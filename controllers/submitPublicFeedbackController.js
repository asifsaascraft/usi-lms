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

    const {
      participantAnswers,
      sendFeedbacks,
      openEndedAnswers,
      sendOtherFeedback,
    } = req.body;

    // Validate webinar
    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: "Webinar not found",
      });
    }

    // Check template exists
    const adminFeedback = await Feedback.findOne({ webinarId });
    if (!adminFeedback) {
      return res.status(400).json({
        success: false,
        message: "Feedback form not created for this webinar",
      });
    }

    // Save
    const feedback = await SubmitPublicFeedback.create({
      webinarId,
      participantAnswers,
      sendFeedbacks,
      openEndedAnswers,
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

    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: "Webinar not found",
      });
    }

    const feedbacks = await SubmitPublicFeedback.find({ webinarId })
      .populate(
        "webinarId",
        "name webinarType startDate endDate startTime endTime timeZone"
      )
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
