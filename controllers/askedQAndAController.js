// controllers/askedQAndAController.js
import AskedQAndA from "../models/AskedQAndA.js";
import Webinar from "../models/Webinar.js";

/**
 * ==============================
 * POST Q&A (Admin only)
 * ==============================
 */
export const createAskedQAndA = async (req, res) => {
  try {
    const { webinarId } = req.params;
    const { questionsAndAnswers } = req.body;

    // Validate webinar
    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: "Webinar not found",
      });
    }

    // Check if Q&A already exists for this webinar
    const existing = await AskedQAndA.findOne({ webinarId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          "Q&A already exists for this webinar.",
      });
    }

    // Create Q&A
    const qna = await AskedQAndA.create({
      webinarId,
      questionsAndAnswers,
    });

    res.status(201).json({
      success: true,
      message: "Q&A created successfully",
      data: qna,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create Q&A",
      error: error.message,
    });
  }
};

/**
 * ==============================
 * GET Q&A by Webinar (Public)
 * ==============================
 */
export const getAskedQAndAByWebinar = async (req, res) => {
  try {
    const { webinarId } = req.params;

    const qna = await AskedQAndA.findOne({ webinarId });

    res.json({
      success: true,
      data: qna || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Q&A",
      error: error.message,
    });
  }
};

/**
 * ==============================
 * UPDATE Q&A (Admin only)
 * ==============================
 */
export const updateAskedQAndA = async (req, res) => {
  try {
    const { webinarId } = req.params;
    const { questionsAndAnswers } = req.body;

    const qna = await AskedQAndA.findOne({ webinarId });
    if (!qna) {
      return res.status(404).json({
        success: false,
        message: "Q&A not found for this webinar",
      });
    }

    qna.questionsAndAnswers = questionsAndAnswers;
    await qna.save();

    res.json({
      success: true,
      message: "Q&A updated successfully",
      data: qna,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update Q&A",
      error: error.message,
    });
  }
};

/**
 * ==============================
 * DELETE Q&A (Admin only)
 * ==============================
 */
export const deleteAskedQAndA = async (req, res) => {
  try {
    const { webinarId } = req.params;

    const qna = await AskedQAndA.findOneAndDelete({ webinarId });
    if (!qna) {
      return res.status(404).json({
        success: false,
        message: "Q&A not found for this webinar",
      });
    }

    res.json({
      success: true,
      message: "Q&A deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete Q&A",
      error: error.message,
    });
  }
};
