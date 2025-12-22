import User from "../models/User.js";
import { generateTokens } from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";
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

    //  Check if mobile already exists
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile already exists",
      });
    }

    // Create user (role = 'user')
    const user = await User.create({
      prefix,
      name,
      email,
      mobile,
      qualification,
      affiliation,
      country,
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
        message:
          "You have registered, but your account is pending approval. Contact admin.",
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // Save refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Success
    return res.json({
      message: "User login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        membershipNumber: user.membershipNumber,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Login user error:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};


// =======================
// Refresh Access Token
// =======================
export const refreshAccessTokenUser = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};


// =======================
// Logout User
// =======================
export const logoutUser = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};


// =======================
// Get Profile
// =======================
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -plainPassword -passwordResetToken -passwordResetExpires"
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
      "name",
      "prefix",
      "qualification",
      "affiliation",
      "mobile",
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
        const oldKey = user.profilePicture.split(`${process.env.AWS_BUCKET_NAME}/`)[1];
        if (oldKey) {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: oldKey,
            })
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

    res.status(200).json({
      message: `User status updated to ${status}`,
      user,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
