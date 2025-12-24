// controllers/quizController.js
import Quiz from "../models/Quiz.js";
import Webinar from "../models/Webinar.js";

/**
 * ==============================
 * CREATE Quiz (Admin only)
 * ==============================
 */
export const createQuiz = async (req, res) => {
  try {
    const { webinarId } = req.params;
    const { quizQuestions, quizduration } = req.body;

    // Validate webinar
    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: "Webinar not found",
      });
    }

    // Create quiz (MULTIPLE allowed)
    const quiz = await Quiz.create({
      webinarId,
      quizQuestions,
      quizduration,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create quiz",
      error: error.message,
    });
  }
};

/**
 * ==============================
 * GET All Quizzes by Webinar (Public)
 * ==============================
 */
export const getQuizzesByWebinar = async (req, res) => {
  try {
    const { webinarId } = req.params;

    const quizzes = await Quiz.find({ webinarId }).populate("webinarId", "name").sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      total: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes",
      error: error.message,
    });
  }
};

/**
 * ==============================
 * GET Quiz by ID (Public)
 * ==============================
 */
export const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId).populate("webinarId");
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    return res.json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quiz",
      error: error.message,
    });
  }
};

/**
 * ==============================
 * UPDATE Quiz (Admin only)
 * ==============================
 */
export const updateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { quizQuestions, quizduration } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quizQuestions) quiz.quizQuestions = quizQuestions;
    if (quizduration) quiz.quizduration = quizduration;

    await quiz.save();

    return res.json({
      success: true,
      message: "Quiz updated successfully",
      data: quiz,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update quiz",
      error: error.message,
    });
  }
};

/**
 * ==============================
 * DELETE Quiz (Admin only)
 * ==============================
 */
export const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findByIdAndDelete(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    return res.json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete quiz",
      error: error.message,
    });
  }
};
