import SubmitPublicFeedback from "../models/SubmitPublicFeedback.js";
import Feedback from "../models/Feedback.js";
import Webinar from "../models/Webinar.js";

/**
 * =========================================
 * POST Public Feedback (No Auth)
 * =========================================
 */
export const submitPublicFeedback = async (req, res) => {
  try {
    const { webinarId } = req.params;
    const { name, email, submitPublicFeedbacks, sendOtherFeedback } = req.body;

    // Validate webinar
    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: "Webinar not found",
      });
    }

    // Check admin feedback exists
    const adminFeedback = await Feedback.findOne({ webinarId });
    if (!adminFeedback) {
      return res.status(400).json({
        success: false,
        message: "Feedback form not created for this webinar",
      });
    }

    // Prevent duplicate submission by email
    const alreadySubmitted = await SubmitPublicFeedback.findOne({
      webinarId,
      email,
    });

    if (alreadySubmitted) {
      return res.status(400).json({
        success: false,
        message: "Feedback already submitted with this email",
      });
    }

    // Save public feedback
    const feedback = await SubmitPublicFeedback.create({
      webinarId,
      name,
      email,
      submitPublicFeedbacks,
      sendOtherFeedback,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
      error: error.message,
    });
  }
};

/**
 * =========================================
 * GET All Public Feedbacks by Webinar (Admin)
 * =========================================
 */
export const getAllPublicFeedbacksByWebinar = async (req, res) => {
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

    const feedbacks = await SubmitPublicFeedback.find({ webinarId })
      .populate("webinarId", "name webinarType")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch public feedbacks",
      error: error.message,
    });
  }
};
