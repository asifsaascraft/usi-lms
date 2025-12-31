// controllers/sendFeedbackController.js
import SendFeedback from "../models/SendFeedback.js";
import Feedback from "../models/Feedback.js";
import Webinar from "../models/Webinar.js";

/**
 * ==============================
 * POST User Feedback (User only)
 * ==============================
 */
export const submitFeedback = async (req, res) => {
  try {
    const { webinarId } = req.params;
    const { userId, sendFeedbacks, sendOtherFeedback } = req.body;
    
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

    // Prevent duplicate submission
    const alreadySubmitted = await SendFeedback.findOne({
      webinarId,
      userId,
    });

    if (alreadySubmitted) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted feedback for this webinar",
      });
    }

    // Save user feedback
    const feedback = await SendFeedback.create({
      webinarId,
      userId,
      sendFeedbacks,
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
 * ==========================================
 * GET Logged-in User Feedback by Webinar
 * ==========================================
 */
export const getMyFeedbackByWebinar = async (req, res) => {
  try {
    const { webinarId } = req.params;
    const userId = req.user.id; // from JWT (protect middleware)

    // Validate webinar
    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: "Webinar not found",
      });
    }

    // Find user's feedback
    const feedback = await SendFeedback.findOne({
      webinarId,
      userId,
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "You have not submitted feedback for this webinar",
      });
    }

    return res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user feedback",
      error: error.message,
    });
  }
};


/**
 * ==========================================
 * GET All Submitted Feedbacks (Admin only)
 * ==========================================
 */
export const getAllSubmitFeedbacksByWebinar = async (req, res) => {
  try {
    const { webinarId } = req.params;

    const feedbacks = await SendFeedback.find({ webinarId })
      .populate("userId", "name email mobile profilePicture")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      total: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch submitted feedbacks",
      error: error.message,
    });
  }
};
