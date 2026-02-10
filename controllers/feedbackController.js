import Feedback from "../models/Feedback.js";
import Webinar from "../models/Webinar.js";

/**
 * ==============================
 * CREATE
 * ==============================
 */
export const createFeedback = async (req, res) => {
  try {
    const { webinarId } = req.params;

    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: "Webinar not found",
      });
    }

    const existing = await Feedback.findOne({ webinarId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Feedback already exists for this webinar",
      });
    }

    const feedback = await Feedback.create({
      webinarId,
      participantFields: req.body.participantFields || [],
      feedbacks: req.body.feedbacks || [],
      openEnded: req.body.openEnded || [],
      closeNote: req.body.closeNote || "",
    });

    res.status(201).json({
      success: true,
      message: "Feedback created successfully",
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create feedback",
      error: error.message,
    });
  }
};

/**
 * ==============================
 * GET (Public)
 * ==============================
 */
export const getFeedbackByWebinar = async (req, res) => {
  try {
    const { webinarId } = req.params;

    const feedback = await Feedback.findOne({ webinarId }).populate(
      "webinarId",
      "name webinarType startDate endDate startTime endTime timeZone"
    );

    res.json({
      success: true,
      data: feedback || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
      error: error.message,
    });
  }
};

/**
 * ==============================
 * UPDATE
 * ==============================
 */
export const updateFeedback = async (req, res) => {
  try {
    const { webinarId } = req.params;

    const feedback = await Feedback.findOne({ webinarId });
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found for this webinar",
      });
    }

    // update only what comes
    if (req.body.participantFields !== undefined)
      feedback.participantFields = req.body.participantFields;

    if (req.body.feedbacks !== undefined)
      feedback.feedbacks = req.body.feedbacks;

    if (req.body.openEnded !== undefined)
      feedback.openEnded = req.body.openEnded;

    if (req.body.closeNote !== undefined)
      feedback.closeNote = req.body.closeNote;

    await feedback.save();

    res.json({
      success: true,
      message: "Feedback updated successfully",
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update feedback",
      error: error.message,
    });
  }
};

/**
 * ==============================
 * DELETE
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

    res.json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete feedback",
      error: error.message,
    });
  }
};
