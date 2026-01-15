// controllers/topicController.js
import Topic from "../models/Topic.js";
import Conference from "../models/Conference.js";
import Session from "../models/Session.js";

// =======================
// Create Topic (admin)
// =======================
export const createTopic = async (req, res) => {
  try {
    const { conferenceId } = req.params;

    const {
      sessionId,
      topicType,
      title,
      startTime,
      endTime,
      videoLink,
      speakerId,
      moderator,
      panelist,
      quizMaster,
      teamMember,
    } = req.body;

    // -----------------------
    // Basic validation
    // -----------------------
    if (!sessionId || !topicType || !title || !startTime || !endTime || !videoLink) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // -----------------------
    // Validate conference
    // -----------------------
    const conference = await Conference.findById(conferenceId);
    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    // -----------------------
    // Validate session
    // -----------------------
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // -----------------------
    // Conditional validation
    // -----------------------
    if (topicType === "Panel Discussion" && !moderator) {
      return res.status(400).json({
        success: false,
        message: "Moderator is required for Panel Discussion",
      });
    }

    if (topicType === "Quiz" && !quizMaster) {
      return res.status(400).json({
        success: false,
        message: "Quiz Master is required for Quiz",
      });
    }

    // -----------------------
    // Create topic
    // -----------------------
    const topic = await Topic.create({
      conferenceId,
      sessionId,
      topicType,
      title,
      startTime,
      endTime,
      videoLink,
      speakerId,
      moderator,
      panelist,
      quizMaster,
      teamMember,
    });

    res.status(201).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create topic",
      error: error.message,
    });
  }
};


// =======================
// Update Topic (admin)
// =======================
export const updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Conditional validation
    if (updateData.topicType === "Panel Discussion" && !updateData.moderator) {
      return res.status(400).json({
        success: false,
        message: "Moderator is required for Panel Discussion",
      });
    }

    if (updateData.topicType === "Quiz" && !updateData.quizMaster) {
      return res.status(400).json({
        success: false,
        message: "Quiz Master is required for Quiz",
      });
    }

    const topic = await Topic.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    res.json({
      success: true,
      data: topic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update topic",
      error: error.message,
    });
  }
};

// =======================
// Delete Topic (admin)
// =======================
export const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;

    const topic = await Topic.findByIdAndDelete(id);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    res.json({
      success: true,
      message: "Topic deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete topic",
      error: error.message,
    });
  }
};

// =======================
// Get Topics by Conference
// =======================
export const getTopicsByConference = async (req, res) => {
  try {
    const { conferenceId } = req.params;

    const topics = await Topic.find({ conferenceId })
      .populate("conferenceId")
      .populate({
        path: "sessionId",
        populate: {
          path: "hallId", //  populate hall details
        },
      })
      .populate("speakerId")
      .sort({ startTime: 1 });

    res.json({
      success: true,
      count: topics.length,
      data: topics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch topics by conference",
      error: error.message,
    });
  }
};

// =======================
// Get Topics by Conference & Session
// =======================
export const getTopicsByConferenceBySession = async (req, res) => {
  try {
    const { conferenceId, sessionId } = req.params;

    const topics = await Topic.find({ conferenceId, sessionId })
      .populate("conferenceId")
      .populate({
        path: "sessionId",
        populate: {
          path: "hallId", //  populate hall details
        },
      })
      .populate("speakerId")
      .sort({ startTime: 1 });

    res.json({
      success: true,
      count: topics.length,
      data: topics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch topics by conference and session",
      error: error.message,
    });
  }
};
