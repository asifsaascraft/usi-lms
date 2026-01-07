// controllers/trackController.js
import Track from "../models/Track.js";
import Conference from "../models/Conference.js";

// =======================
// Create Track (admin)
// =======================
export const createTrack = async (req, res) => {
  try {
    const { conferenceId } = req.params;
    const { trackName, status } = req.body;

    // Validate conference
    const conference = await Conference.findById(conferenceId);
    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    const track = await Track.create({
      conferenceId,
      trackName,
      status,
    });

    res.status(201).json({
      success: true,
      data: track,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create track",
      error: error.message,
    });
  }
};

// =======================
// Get all tracks of a conference (public)
// =======================
export const getTracksByConference = async (req, res) => {
  try {
    const { conferenceId } = req.params;

    const tracks = await Track.find({ conferenceId })
      .populate("conferenceId")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      total: tracks.length,
      data: tracks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tracks",
      error: error.message,
    });
  }
};

// =======================
// Get active tracks of a conference (public)
// =======================
export const getActiveTracksByConference = async (req, res) => {
  try {
    const { conferenceId } = req.params;

    const tracks = await Track.find({
      conferenceId,
      status: "Active",
    })
      .populate("conferenceId")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      total: tracks.length,
      data: tracks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch active tracks",
      error: error.message,
    });
  }
};

// =======================
// Update track (admin)
// =======================
export const updateTrack = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTrack = await Track.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTrack) {
      return res.status(404).json({
        success: false,
        message: "Track not found",
      });
    }

    res.json({
      success: true,
      data: updatedTrack,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update track",
      error: error.message,
    });
  }
};

// =======================
// Delete track (admin)
// =======================
export const deleteTrack = async (req, res) => {
  try {
    const { id } = req.params;

    const track = await Track.findByIdAndDelete(id);

    if (!track) {
      return res.status(404).json({
        success: false,
        message: "Track not found",
      });
    }

    res.json({
      success: true,
      message: "Track deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete track",
      error: error.message,
    });
  }
};
