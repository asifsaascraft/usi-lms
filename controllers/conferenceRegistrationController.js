// controllers/conferenceRegistrationController.js

import ConferenceRegistration from "../models/ConferenceRegistration.js";
import Conference from "../models/Conference.js";
import User from "../models/User.js";

// ==============================
// Register user into conference
// ==============================
export const registerToConference = async (req, res) => {
  try {
    const { conferenceId, userId, email, mobile, membershipNumber } = req.body;

    // ------------------------------------
    // Validate required IDs
    // ------------------------------------
    if (!conferenceId || !userId) {
      return res.status(400).json({
        success: false,
        message: "conferenceId and userId are required",
      });
    }

    // Check conference exists
    const conference = await Conference.findById(conferenceId);
    if (!conference) {
      return res.status(400).json({
        success: false,
        message: "Invalid conferenceId",
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
    // At least one identifier required
    // ------------------------------------
    if (!email && !mobile && !membershipNumber) {
      return res.status(400).json({
        success: false,
        message:
          "Must provide either email or mobile or membershipNumber to register",
      });
    }

    // ------------------------------------
    // Validate data against User record
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
    const alreadyRegistered = await ConferenceRegistration.findOne({
      conferenceId,
      userId,
    });

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: "User already registered for this conference",
      });
    }

    // ------------------------------------
    // Register now
    // ------------------------------------
    const newRegistration = await ConferenceRegistration.create({
      conferenceId,
      userId,
      email,
      mobile,
      membershipNumber,
    });

    return res.status(201).json({
      success: true,
      message: "Conference registration successful",
      data: newRegistration,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Conference registration failed",
      error: error.message,
    });
  }
};

// =====================================
// Get all conferences registered by user
// =====================================
export const getUserConferenceRegistrations = async (req, res) => {
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

    const registrations = await ConferenceRegistration.find({ userId })
      .populate("conferenceId")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      total: registrations.length,
      data: registrations.map((x) => ({
        id: x._id,
        conference: x.conferenceId,
        registeredOn: x.createdAt,
        email: x.email,
        mobile: x.mobile,
        membershipNumber: x.membershipNumber,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch conference registrations",
      error: error.message,
    });
  }
};

// =====================================
// Admin - Get all registrations of a conference
// =====================================
export const getConferenceRegistrationsForAdmin = async (req, res) => {
  try {
    const { conferenceId } = req.params;

    // Validate conference
    const conference = await Conference.findById(conferenceId);
    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    const registrations = await ConferenceRegistration.find({ conferenceId })
      .populate("userId", "name email mobile prefix")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      conference: {
        id: conference._id,
        name: conference.name,
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
