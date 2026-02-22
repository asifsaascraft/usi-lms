// controllers/conferenceController.js
import Conference from "../models/Conference.js";
import { getPagination, buildPaginationMeta } from "../utils/pagination.js";

// =======================
// Get all conferences (public)
// =======================
export const getConferences = async (req, res) => {
  try {

    const { page, limit, skip } = getPagination(req);

    const total = await Conference.countDocuments();

    const conferences = await Conference.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const pagination = buildPaginationMeta(total, page, limit);

    res.json({
      success: true,
      pagination,
      data: conferences.map(c => c.toObject({ virtuals: true })),
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch conferences",
      error: error.message,
    });
  }
};

// =======================
// Get active conferences (public)
// =======================
export const getActiveConferences = async (req, res) => {
  try {

    const { page, limit, skip } = getPagination(req);

    const filter = { status: "Active" };

    const total = await Conference.countDocuments(filter);

    const conferences = await Conference.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const pagination = buildPaginationMeta(total, page, limit);

    res.json({
      success: true,
      pagination,
      data: conferences.map(c => c.toObject({ virtuals: true })),
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch active conferences",
      error: error.message,
    });
  }
};

// =======================
// Get single conference by ID (public)
// =======================
export const getConferenceById = async (req, res) => {
  try {
    const { id } = req.params;

    const conference = await Conference.findById(id);
    if (!conference) {
      return res
        .status(404)
        .json({ success: false, message: "Conference not found" });
    }

    res.json({
      success: true,
      data: conference.toObject({ virtuals: true }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch conference",
      error: error.message,
    });
  }
};

// =======================
// Create conference (admin only)
// =======================
export const createConference = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Conference image is required",
      });
    }

    const conferenceData = {
      ...req.body,
      image: req.file.location,
    };

    const newConference = await Conference.create(conferenceData);

    res.status(201).json({
      success: true,
      data: newConference.toObject({ virtuals: true }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create conference",
      error: error.message,
    });
  }
};

// =======================
// Update conference (admin only)
// =======================
export const updateConference = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedData = { ...req.body };
    if (req.file) updatedData.image = req.file.location;

    const updatedConference = await Conference.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedConference) {
      return res
        .status(404)
        .json({ success: false, message: "Conference not found" });
    }

    res.json({
      success: true,
      data: updatedConference.toObject({ virtuals: true }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update conference",
      error: error.message,
    });
  }
};

// =======================
// Delete conference (admin only)
// =======================
export const deleteConference = async (req, res) => {
  try {
    const { id } = req.params;

    const conference = await Conference.findByIdAndDelete(id);

    if (!conference) {
      return res
        .status(404)
        .json({ success: false, message: "Conference not found" });
    }

    res.json({
      success: true,
      message: "Conference deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete conference",
      error: error.message,
    });
  }
};

// =======================
// Get conference date range (admin only)
// =======================
export const getConferenceDateRange = async (req, res) => {
  try {
    const { conferenceId } = req.params;

    const conference = await Conference.findById(conferenceId);
    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    const { startDate, endDate } = conference;

    // Convert DD/MM/YYYY → Date
    const parseDate = (str) => {
      const [day, month, year] = str.split("/").map(Number);
      return new Date(year, month - 1, day);
    };

    // Format Date → DD/MM/YYYY
    const formatDate = (date) => {
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const yyyy = date.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    };

    // Get Day Name (Thursday, Friday, etc.)
    const getDayName = (date) => {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    };

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    const dates = [];
    const current = new Date(start);

    while (current <= end) {
      dates.push({
        date: formatDate(current),
        day: getDayName(current),
      });
      current.setDate(current.getDate() + 1);
    }

    res.json({
      success: true,
      conferenceId,
      startDate,
      endDate,
      dates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch conference date range",
      error: error.message,
    });
  }
};

