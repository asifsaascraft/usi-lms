import User from "../models/User.js";
import { generateTokens } from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";
import sendEmailWithTemplate from "../utils/sendEmail.js";
import sendOtpSMS from "../utils/sendOtpSMS.js";
import crypto from "crypto";
import { getCookieOptions } from "../utils/cookieOptions.js";

/* =========================
   GET CURRENT USER SESSION
========================= */
export const getUserSession = async (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-store");

    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ authenticated: false });
    }

    if (decoded.type !== "access") {
      return res.status(401).json({ authenticated: false });
    }

    const user = await User.findById(decoded.id).select(
      "-password -passwordResetToken -passwordResetExpires",
    );

    if (!user || user.role !== "user") {
      return res.status(401).json({ authenticated: false });
    }

    res.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ authenticated: false });
  }
};

// =======================
// User Signup (Public)
// =======================
export const registerUser = async (req, res) => {
  try {
    const {
      prefix,
      name,
      email,
      mobile,
      qualification,
      affiliation,
      country,
    } = req.body;


    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if mobile already exists
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile already exists",
      });
    }

    // Create user
    const user = await User.create({
      prefix,
      name,
      email,
      mobile,
      qualification,
      affiliation,
      country,
      uploadDocument: req.file.location, 
      role: "user",
      status: "Pending",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });

    const admin = await User.findOne({ role: "admin" });

    try {
      if (admin) {
        await sendEmailWithTemplate({
          to: admin.email,
          name: admin.name,
          templateKey:
            "2518b.554b0da719bc314.k1.03fd64b0-e86e-11f0-943e-cabf48e1bf81.19b828ef67b",
          mergeInfo: {
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            qualification: user.qualification || "NA",
            affiliation: user.affiliation || "N/A",
            country: user.country,
          },
        });
      }
    } catch (err) {
      console.error("Admin email failed:", err.message);
    }
  } catch (error) {
    console.error("Register user error:", error);
    res.status(500).json({ message: error.message });
  }
};


// =======================
// User Login
// =======================
export const loginUser = async (req, res) => {
  try {
    const { email, mobile, membershipNumber } = req.body;

    // Validate - atleast one field must be entered
    if (!email && !mobile && !membershipNumber) {
      return res.status(400).json({
        message: "Please enter email or mobile or membership number",
      });
    }

    let user;

    // CASE 1: Login using Email
    if (email) {
      user = await User.findOne({ email, role: "user" });
      if (!user) {
        return res.status(400).json({
          message: "Invalid email",
        });
      }
    }

    // CASE 2: Login using Mobile
    if (mobile) {
      user = await User.findOne({ mobile, role: "user" });
      if (!user) {
        return res.status(400).json({
          message: "Invalid mobile number",
        });
      }

      // Mobile format validation (optional)
      if (!/^\d{10}$/.test(mobile)) {
        return res.status(400).json({
          message: "Mobile number must be 10 digits",
        });
      }
    }

    // CASE 3: Login using Membership Number
    if (membershipNumber) {
      user = await User.findOne({ membershipNumber, role: "user" });
      if (!user) {
        return res.status(400).json({
          message: "Invalid membership number",
        });
      }
    }

    // STATUS CHECK
    if (user.status !== "Approved") {
      return res.status(403).json({
        message: "You have registered successfully, wait for admin approval.",
      });
    }

    // =======================
    // OTP Rate Limiting (ADD HERE)
    // =======================
    if (user.loginOtpExpires && user.loginOtpExpires > Date.now()) {
      const waitSeconds = Math.ceil((user.loginOtpExpires - Date.now()) / 1000);

      return res.status(429).json({
        message: `OTP already sent. Please wait ${waitSeconds} seconds before requesting a new OTP.`,
      });
    }
    //  Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.loginOtp = crypto.createHash("sha256").update(otp).digest("hex");

    user.loginOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    //  Send OTP Email
    await sendEmailWithTemplate({
      to: user.email,
      name: user.name,
      templateKey:
        "2518b.554b0da719bc314.k1.6e2d6570-eae3-11f0-a3cd-525400c92439.19b92abe547",
      mergeInfo: {
        name: user.name,
        otp,
      },
    });

    //  Send OTP SMS

    try {
      await sendOtpSMS(user.mobile, otp);
    } catch (smsError) {
      console.error("SMS sending failed:", smsError.message);
    }

    return res.json({
      message: "OTP sent to your email and mobile",
      userId: user._id,
    });
  } catch (error) {
    console.error("Login OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// Verify OTP
// =======================
export const verifyLoginOtp = async (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-store");

    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: "OTP required" });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.findOne({
      _id: userId,
      loginOtp: hashedOtp,
      loginOtpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP
    user.loginOtp = null;
    user.loginOtpExpires = null;
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    res.cookie("accessToken", accessToken, {
      ...getCookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.cookie("refreshToken", refreshToken, {
      ...getCookieOptions(),
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// Refresh Access Token
// =======================
export const refreshAccessTokenUser = async (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-store");
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "NO_REFRESH_TOKEN" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    //  ADD THIS
    if (decoded.type !== "refresh") {
      return res.status(401).json({ message: "INVALID_REFRESH_TOKEN" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "USER_NOT_FOUND" });
    }
    // (USER ROLE CHECK)
    if (user.role !== "user") {
      return res.status(403).json({ message: "NOT_USER_TOKEN" });
    }

    const { accessToken } = generateTokens(user._id, user.role);

    //  FIX cookie expiry (see next section)
    res.cookie("accessToken", accessToken, {
      ...getCookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.json({ success: true });
  } catch (err) {
    res.clearCookie("accessToken", getCookieOptions());
    return res.status(401).json({ message: "INVALID_REFRESH_TOKEN" });
  }
};

// =======================
// Logout User
// =======================
export const logoutUser = (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  res.clearCookie("accessToken", getCookieOptions());
  res.clearCookie("refreshToken", getCookieOptions());
  res.json({ message: "Logged out successfully" });
};

// =======================
// Get Profile
// =======================
export const getUserProfile = async (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-store");

    const user = await User.findById(req.user._id).select(
      "-password -plainPassword -passwordResetToken -passwordResetExpires",
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// =======================
// Update Profile
// =======================
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const fields = [
      "qualification",
      "affiliation",
      "country",
      "city",
      "state",
      "pincode",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    // Update profile picture
    if (req.file && req.file.location) {
      // Delete old image from S3
      if (user.profilePicture) {
        const oldKey = user.profilePicture.split(
          `${process.env.AWS_BUCKET_NAME}/`,
        )[1];
        if (oldKey) {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: oldKey,
            }),
          );
        }
      }
      user.profilePicture = req.file.location;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// =======================
// Get All Users – Admin only
// =======================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password -passwordResetToken -passwordResetExpires")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All users fetched successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// =======================
// Update User Status – Admin only
// =======================
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body; // expected: "Pending" or "Approved"

    // Validate status input
    if (!["Pending", "Approved"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value. Allowed: Pending, Approved",
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update status
    user.status = status;
    await user.save();

    // =======================
    // Send Email to User
    // =======================
    try {
      await sendEmailWithTemplate({
        to: user.email,
        name: user.name,
        templateKey:
          "2518b.554b0da719bc314.k1.59e7fe80-e896-11f0-943e-cabf48e1bf81.19b83974e68",
        mergeInfo: {
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          status: user.status,
          status_message:
            status === "Approved"
              ? "Your account has been approved. You can now log in and access all services."
              : "Your account status has been changed to pending. Please wait for further updates.",
        },
      });
    } catch (emailErr) {
      console.error("User status email failed:", emailErr.message);
    }

    res.status(200).json({
      message: `User status updated to ${status}`,
      user,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// =======================
// Delete User – Admin only
// =======================
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting himself (optional but recommended)
    if (req.user._id.toString() === userId) {
      return res.status(400).json({
        message: "Admin cannot delete own account",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Ensure only USER accounts can be deleted
    if (user.role !== "user") {
      return res.status(403).json({
        message: "Only user accounts can be deleted",
      });
    }

    // =======================
    // Send Deletion Email
    // =======================
    try {
      await sendEmailWithTemplate({
        to: user.email,
        name: user.name,
        templateKey: "2518b.554b0da719bc314.k1.4ba14761-fce0-11f0-9f12-62df313bf14d.19c088e56d3",
        mergeInfo: {
          name: user.name,
          email: user.email,
          mobile: user.mobile,
        },
      });
    } catch (emailErr) {
      console.error("Delete user email failed:", emailErr.message);
    }

    // Delete user after email attempt
    await user.deleteOne();

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
