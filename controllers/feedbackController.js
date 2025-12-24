// controllers/feedbackController.js
import Feedback from "../models/Feedback.js";
import Webinar from "../models/Webinar.js";

/**
 * ==============================
 * CREATE Feedback (Admin only)
 * ==============================
 */
export const createFeedback = async (req, res) => {
  try {
    const { webinarId } = req.params;
    const { feedbacks } = req.body;

    // Validate webinar
    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: "Webinar not found",
      });
    }

    // Check if feedback already exists for this webinar
    const existing = await Feedback.findOne({ webinarId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Feedback already exists for this webinar",
      });
    }

    // Create feedback
    const feedback = await Feedback.create({
      webinarId,
      feedbacks,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback created successfully",
      data: feedback,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create feedback",
      error: error.message,
    });
  }
};

/**
 * ==============================
 * GET Feedback by Webinar (Public)
 * ==============================
 */
export const getFeedbackByWebinar = async (req, res) => {
  try {
    const { webinarId } = req.params;

    const feedback = await Feedback.findOne({ webinarId });

    return res.json({
      success: true,
      data: feedback || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
      error: error.message,
    });
  }
};

/**
 * ==============================
 * UPDATE Feedback (Admin only)
 * ==============================
 */
export const updateFeedback = async (req, res) => {
  try {
    const { webinarId } = req.params;
    const { feedbacks } = req.body;

    const feedback = await Feedback.findOne({ webinarId });
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found for this webinar",
      });
    }

    feedback.feedbacks = feedbacks;
    await feedback.save();

    return res.json({
      success: true,
      message: "Feedback updated successfully",
      data: feedback,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update feedback",
      error: error.message,
    });
  }
};

/**
 * ==============================
 * DELETE Feedback (Admin only)
 * ==============================
 */
export const deleteFeedback = async (req, res) => {
  try {
    const { webinarId } = req.params;

    const feedback = await Feedback.findOneAndDelete({ webinarId });
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found for this webinar",
      });
    }

    return res.json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete feedback",
      error: error.message,
    });
  }
};
