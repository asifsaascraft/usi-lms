import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { generateTokens } from '../utils/generateTokens.js'
import sendEmailWithTemplate from '../utils/sendEmail.js'
import { getCookieOptions } from '../utils/cookieOptions.js'

/* =========================
   GET CURRENT ADMIN SESSION
========================= */
export const getAdminSession = async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store')

    const token = req.cookies.accessToken
    if (!token) {
      return res.status(401).json({ authenticated: false })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch {
      return res.status(401).json({ authenticated: false })
    }

    if (decoded.type !== 'access') {
      return res.status(401).json({ authenticated: false })
    }

    const admin = await User.findById(decoded.id).select(
      '-password -passwordResetToken -passwordResetExpires'
    )

    if (!admin || admin.role !== 'admin') {
      return res.status(401).json({ authenticated: false })
    }

    res.json({
      authenticated: true,
      user: admin,
    })
  } catch (error) {
    res.status(500).json({ authenticated: false })
  }
}

// =======================
// Admin Signup (Postman only)
// =======================
export const registerAdmin = async (req, res) => {
  try {
    const { prefix, name, email, mobile, qualification, affiliation, country, password } = req.body;

    // only one admin allowed
    const existing = await User.findOne({ role: "admin" });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await User.create({
      prefix,
      name,
      email,
      mobile,
      qualification,
      affiliation,
      country,
      password,
      role: "admin",
      status: "Approved",
    });

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =========================
   ADMIN LOGIN
========================= */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body

    const admin = await User.findOne({ email, role: 'admin' })
    if (!admin) {
      return res.status(400).json({ message: 'Email does not exist' })
    }

    const isMatch = await admin.matchPassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong password' })
    }

    const { accessToken, refreshToken } = generateTokens(
      admin._id,
      admin.role
    )

    res.cookie('accessToken', accessToken, {
      ...getCookieOptions(),
      maxAge: 15 * 60 * 1000, // 15 minutes
    })

    res.cookie('refreshToken', refreshToken, {
      ...getCookieOptions(),
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })

    res.json({
      message: 'Admin login successful',
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* =========================
   REFRESH ACCESS TOKEN
========================= */
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      return res.status(401).json({ message: 'NO_REFRESH_TOKEN' })
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    )

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ message: 'INVALID_REFRESH_TOKEN' })
    }

    const admin = await User.findById(decoded.id)
    if (!admin || admin.role !== 'admin') {
      return res.status(401).json({ message: 'INVALID_USER' })
    }

    const { accessToken } = generateTokens(admin._id, admin.role)

    res.cookie('accessToken', accessToken, {
      ...getCookieOptions(),
      maxAge: 15 * 60 * 1000, // 15 minutes
    })

    res.json({ success: true })
  } catch (err) {
    res.clearCookie('accessToken', getCookieOptions())
    res.status(401).json({ message: 'REFRESH_TOKEN_EXPIRED' })
  }
}

/* =========================
   LOGOUT
========================= */
export const logoutAdmin = (req, res) => {
  res.clearCookie('accessToken', getCookieOptions())
  res.clearCookie('refreshToken', getCookieOptions())

  res.json({ message: 'Logged out successfully' })
}

// =======================
// Forgot Password
// =======================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find admin
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const resetToken = crypto.createHash("sha256").update(token.trim()).digest("hex");

    admin.passwordResetToken = resetToken;
    admin.passwordResetExpires = Date.now() + 24 * 60 * 60 * 1000;
    await admin.save({ validateBeforeSave: false });

    const frontendUrl = process.env.ADMIN_FRONTEND_URL;
    const resetUrl = `${frontendUrl}/reset-password/${token}`;

    // Send email via ZeptoMail template
    await sendEmailWithTemplate({
      to: admin.email,
      name: admin.name,
      templateKey: "2518b.554b0da719bc314.k1.6f29f192-dd74-11f0-91a1-621740bce2a6.19b3aa21729",
      mergeInfo: {
        name: admin.name,
        password_reset_link: resetUrl,
      },
    });

    res.json({ message: "Password reset link sent to your email address" });
  } catch (error) {
    console.error("Forgot password error:", error?.response?.data || error.message || error);
    res.status(500).json({ message: "Failed to send reset email" });
  }
};

// =======================
// Reset Password
// =======================
export const resetPassword = async (req, res) => {
  try {
    let { token } = req.params; // get token from URL
    const { password } = req.body;

    if (!token) return res.status(400).json({ message: "Token is required" });

    // Trim token to remove extra spaces/newlines
    token = token.trim();

    // Hash token to match DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update password
    admin.password = password; // will be hashed in pre-save hook
    admin.passwordResetToken = null;
    admin.passwordResetExpires = null;
    await admin.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: error.message });
  }
};