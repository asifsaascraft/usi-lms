// controllers/webinarRegistrationController.js

import WebinarRegistration from "../models/WebinarRegistration.js";
import Webinar from "../models/Webinar.js";
import User from "../models/User.js";

// ==============================
// Register user into webinar
// ==============================
export const registerToWebinar = async (req, res) => {
  try {
    const { webinarId, userId, email, mobile, membershipNumber } = req.body;

    // ------------------------------------
    // Validate required IDs exist
    // ------------------------------------
    if (!webinarId || !userId) {
      return res.status(400).json({
        success: false,
        message: "webinarId and userId are required",
      });
    }

    // Check webinar exists
    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(400).json({
        success: false,
        message: "Invalid webinarId",
      });
    }

    // Check user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    // ------------------------------------
    // Must provide at least 1 field:
    // email OR mobile OR membershipNumber
    // ------------------------------------
    if (!email && !mobile && !membershipNumber) {
      return res.status(400).json({
        success: false,
        message:
          "Must provide either email or mobile or membershipNumber to register",
      });
    }

    // ------------------------------------
    // VALIDATE provided fields from user DB
    // ------------------------------------
    if (email && user.email !== email) {
      return res.status(400).json({
        success: false,
        message: "Email does not match with user",
      });
    }

    if (mobile && user.mobile !== mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile does not match with user",
      });
    }

    if (membershipNumber && user.membershipNumber !== membershipNumber) {
      return res.status(400).json({
        success: false,
        message: "Membership Number does not match with user",
      });
    }

    // ------------------------------------
    // Prevent duplicate registration
    // ------------------------------------
    const alreadyRegistered = await WebinarRegistration.findOne({
      webinarId,
      userId,
    });

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: "User already registered for this webinar",
      });
    }

    // ------------------------------------
    // Register now
    // ------------------------------------
    const newRegistration = await WebinarRegistration.create({
      webinarId,
      userId,
      email,
      mobile,
      membershipNumber,
    });

    return res.status(201).json({
      success: true,
      message: "Webinar registration successful",
      data: newRegistration,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Webinar registration failed",
      error: error.message,
    });
  }
};

// ==============================
// Get all webinars registered by a particular user
// ==============================
export const getUserWebinarRegistrations = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    const registrations = await WebinarRegistration.find({ userId })
      .populate("webinarId")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      total: registrations.length,
      data: registrations.map((x) => ({
        id: x._id,
        webinar: x.webinarId,
        registeredOn: x.createdAt,
        email: x.email,
        mobile: x.mobile,
        membershipNumber: x.membershipNumber,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch webinar registrations",
      error: error.message,
    });
  }
};

