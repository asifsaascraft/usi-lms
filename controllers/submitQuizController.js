import SubmitQuiz from "../models/SubmitQuiz.js";
import Quiz from "../models/Quiz.js";
import Webinar from "../models/Webinar.js";

/**
 * ==============================
 * SUBMIT QUIZ (User only)
 * ==============================
 */
export const submitQuiz = async (req, res) => {
  try {
    const { webinarId, quizId } = req.params;
    const { userId, answers } = req.body;

    // Validate webinar
    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: "Webinar not found",
      });
    }

    // Validate quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Prevent duplicate submission
    const alreadySubmitted = await SubmitQuiz.findOne({
      quizId,
      userId,
    });

    if (alreadySubmitted) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted this quiz",
      });
    }

    // Save submission
    const submission = await SubmitQuiz.create({
      webinarId,
      quizId,
      userId,
      answers,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz submitted successfully",
      data: submission,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit quiz",
      error: error.message,
    });
  }
};

/**
 * ==================================
 * GET ALL SUBMITTED QUIZZES (Admin)
 * ==================================
 */
export const getAllSubmittedQuizzesByQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const submissions = await SubmitQuiz.find({ quizId })
      .populate("userId", "name email mobile profilePicture")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      total: submissions.length,
      data: submissions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch submitted quizzes",
      error: error.message,
    });
  }
};

/**
 * ==========================================
 * GET All Submitted Quizzes by Webinar (Admin)
 * ==========================================
 */
export const getAllSubmittedQuizzesByWebinar = async (req, res) => {
  try {
    const { webinarId } = req.params;

    const submissions = await SubmitQuiz.find({ webinarId })
      .populate("userId", "name email mobile profilePicture")
      .populate("quizId", "quizduration quizQuestions")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      total: submissions.length,
      data: submissions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch submitted quizzes by webinar",
      error: error.message,
    });
  }
};

/**
 * ==========================================
 * GET Quiz Result (User only)
 * ==========================================
 */
export const getQuizResult = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id; // coming from auth middleware

    // Find submission
    const submission = await SubmitQuiz.findOne({
      quizId,
      userId,
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Quiz not submitted yet",
      });
    }

    // Fetch quiz for correct answers
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    let correctCount = 0;

    const result = submission.answers.map((ans) => {
      const question = quiz.quizQuestions.find(
        (q) => q._id.toString() === ans.questionId.toString()
      );

      const isCorrect =
        question && question.correctAnswer === ans.selectedOption;

      if (isCorrect) correctCount++;

      return {
        questionId: ans.questionId,
        questionName: ans.questionName,
        selectedOption: ans.selectedOption,
        correctAnswer: question?.correctAnswer || null,
        isCorrect,
      };
    });

    const totalQuestions = quiz.quizQuestions.length;
    const scorePercentage = Math.round(
      (correctCount / totalQuestions) * 100
    );

    return res.json({
      success: true,
      data: {
        quizId,
        totalQuestions,
        correctAnswers: correctCount,
        scorePercentage,
        result,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quiz result",
      error: error.message,
    });
  }
};
