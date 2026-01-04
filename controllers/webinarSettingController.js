// controllers/webinarSettingController.js
import WebinarSetting from "../models/WebinarSetting.js";
import Webinar from "../models/Webinar.js";

/**
 * ==============================
 * CREATE Webinar Setting (Admin)
 * ==============================
 */
export const createWebinarSetting = async (req, res) => {
  try {
    const { webinarId } = req.params;
    const settingsData = req.body;

    // Validate webinar
    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: "Webinar not found",
      });
    }

    // Check if setting already exists
    const existing = await WebinarSetting.findOne({ webinarId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Webinar setting already exists",
      });
    }

    const setting = await WebinarSetting.create({
      webinarId,
      ...settingsData,
    });

    return res.status(201).json({
      success: true,
      message: "Webinar setting created successfully",
      data: setting,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create webinar setting",
      error: error.message,
    });
  }
};

/**
 * ==================================
 * GET Webinar Setting by Webinar (Public)
 * ==================================
 */
export const getWebinarSettingByWebinar = async (req, res) => {
  try {
    const { webinarId } = req.params;

    const setting = await WebinarSetting.findOne({ webinarId })
      .populate("webinarId");

    return res.json({
      success: true,
      data: setting || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch webinar setting",
      error: error.message,
    });
  }
};

/**
 * ==================================
 * GET All Webinar Settings (Admin)
 * ==================================
 */
export const getAllWebinarSettings = async (req, res) => {
  try {
    const settings = await WebinarSetting.find()
      .populate("webinarId");

    return res.json({
      success: true,
      count: settings.length,
      data: settings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch webinar settings",
      error: error.message,
    });
  }
};

/**
 * ==============================
 * UPDATE Webinar Setting (Admin)
 * ==============================
 */
export const updateWebinarSetting = async (req, res) => {
  try {
    const { webinarId } = req.params;
    const updates = req.body;

    const setting = await WebinarSetting.findOne({ webinarId });
    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Webinar setting not found",
      });
    }

    Object.assign(setting, updates);
    await setting.save();

    return res.json({
      success: true,
      message: "Webinar setting updated successfully",
      data: setting,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update webinar setting",
      error: error.message,
    });
  }
};

/**
 * ==============================
 * DELETE Webinar Setting (Admin)
 * ==============================
 */
export const deleteWebinarSetting = async (req, res) => {
  try {
    const { webinarId } = req.params;

    const setting = await WebinarSetting.findOneAndDelete({ webinarId });
    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Webinar setting not found",
      });
    }

    return res.json({
      success: true,
      message: "Webinar setting deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete webinar setting",
      error: error.message,
    });
  }
};
