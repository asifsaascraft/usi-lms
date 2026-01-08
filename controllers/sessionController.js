// controllers/sessionController.js
import Session from "../models/Session.js";
import Conference from "../models/Conference.js";
import Hall from "../models/Hall.js";
import Track from "../models/Track.js";

// =======================
// Create Session (admin)
// =======================
export const createSession = async (req, res) => {
  try {
    const { conferenceId } = req.params;
    const {
      sessionName,
      sessionDate,
      hallId,
      trackId,
      startTime,
      endTime,
      description,
    } = req.body;

    // Validate conference
    const conference = await Conference.findById(conferenceId);
    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    // Validate hall
    const hall = await Hall.findOne({ _id: hallId, conferenceId });
    if (!hall) {
      return res.status(404).json({
        success: false,
        message: "Hall not found for this conference",
      });
    }

    // Validate track
    const track = await Track.findOne({ _id: trackId, conferenceId });
    if (!track) {
      return res.status(404).json({
        success: false,
        message: "Track not found for this conference",
      });
    }

    const session = await Session.create({
      conferenceId,
      sessionName,
      sessionDate,
      hallId,
      trackId,
      startTime,
      endTime,
      description,
    });

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create session",
      error: error.message,
    });
  }
};

// =======================
// Get all sessions of a conference (public)
// =======================
export const getSessionsByConference = async (req, res) => {
  try {
    const { conferenceId } = req.params;

    const sessions = await Session.find({ conferenceId })
      .populate("conferenceId")
      .populate("hallId")
      .populate("trackId")
      .sort({ sessionDate: 1, startTime: 1 });

    res.json({
      success: true,
      total: sessions.length,
      data: sessions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch sessions",
      error: error.message,
    });
  }
};

// =======================
// Get sessions by date (public)
// =======================
export const getSessionsByDate = async (req, res) => {
  try {
    const { conferenceId, date } = req.params;

    const sessions = await Session.find({
      conferenceId,
      sessionDate: date,
    })
      .populate("hallId")
      .populate("trackId")
      .sort({ startTime: 1 });

    res.json({
      success: true,
      total: sessions.length,
      data: sessions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch sessions by date",
      error: error.message,
    });
  }
};

// =======================
// Update session (admin)
// =======================
export const updateSession = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedSession = await Session.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSession) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.json({
      success: true,
      data: updatedSession,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update session",
      error: error.message,
    });
  }
};

// =======================
// Delete session (admin)
// =======================
export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findByIdAndDelete(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete session",
      error: error.message,
    });
  }
};
