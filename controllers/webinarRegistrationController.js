// controllers/webinarRegistrationController.js

import WebinarRegistration from "../models/WebinarRegistration.js";
import Webinar from "../models/Webinar.js";
import User from "../models/User.js";
import moment from "moment-timezone";

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

// ==============================
// Admin → Simple list of registrations of a webinar
// ==============================
export const getWebinarRegistrationsForAdminSimple = async (req, res) => {
  try {
    const { webinarId } = req.params;

    // Validate webinar
    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: "Webinar not found",
      });
    }

    const registrations = await WebinarRegistration.find({ webinarId })
      .populate("userId", "name email mobile prefix")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      webinar: {
        id: webinar._id,
        name: webinar.name,
      },
      total: registrations.length,
      data: registrations.map((r) => ({
        registrationId: r._id,
        registeredOn: r.createdAt,
        user: r.userId,
        email: r.email,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch registrations",
      error: error.message,
    });
  }
};


/**
 * =====================================================
 * ADMIN: Get ALL registrations (attended + not attended) for particular Webinar
 * =====================================================
 * GET /admin/webinar/:webinarId/registrations
 */
export const getAllWebinarRegistrations = async (req, res) => {
  try {
    const { webinarId } = req.params;

    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: "Webinar not found",
      });
    }

    const registrations = await WebinarRegistration.find({ webinarId })
      .populate("userId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      webinar: {
        id: webinar._id,
        name: webinar.name,
        startDate: webinar.startDate,
        startTime: webinar.startTime,
        endDate: webinar.endDate,
        endTime: webinar.endTime,
        attendedMailSent: webinar.attendedMailSent,
        notAttendedMailSent: webinar.notAttendedMailSent,
      },
      total: registrations.length,
      attendedCount: registrations.filter(r => r.attended).length,
      notAttendedCount: registrations.filter(r => !r.attended).length,
      data: registrations,
    });
  } catch (error) {
    console.error("Get all webinar registrations error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch webinar registrations",
      error: error.message,
    });
  }
};
/**
 * ==========================================
 * ADMIN: Get ONLY attended users
 * ==========================================
 * GET /admin/webinar/:webinarId/attended
 */
export const getAttendedUsers = async (req, res) => {
  try {
    const { webinarId } = req.params;

    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: "Webinar not found",
      });
    }

    const attendedUsers = await WebinarRegistration.find({
      webinarId,
      attended: true,
    })
      .populate("userId")
      .sort({ attendedAt: -1 });

    return res.status(200).json({
      success: true,
      webinar: {
        id: webinar._id,
        name: webinar.name,
        attendedMailSent: webinar.attendedMailSent,
        notAttendedMailSent: webinar.notAttendedMailSent,
      },
      count: attendedUsers.length,
      data: attendedUsers,
    });
  } catch (error) {
    console.error("Get attended users error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch attended users",
      error: error.message,
    });
  }
};

/**
 * ==========================================
 * ADMIN: Get registered BUT NOT attended users
 * ==========================================
 * GET /admin/webinar/:webinarId/not-attended
 */
export const getNotAttendedUsers = async (req, res) => {
  try {
    const { webinarId } = req.params;

    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: "Webinar not found",
      });
    }

    const notAttendedUsers = await WebinarRegistration.find({
      webinarId,
      attended: false,
    })
      .populate("userId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      webinar: {
        id: webinar._id,
        name: webinar.name,
        attendedMailSent: webinar.attendedMailSent,
        notAttendedMailSent: webinar.notAttendedMailSent,
      },
      count: notAttendedUsers.length,
      data: notAttendedUsers,
    });
  } catch (error) {
    console.error("Get not attended users error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch not attended users",
      error: error.message,
    });
  }
};