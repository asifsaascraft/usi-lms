import express from "express";
import {
  submitQuiz,
  getAllSubmittedQuizzesByQuiz,
  getAllSubmittedQuizzesByWebinar,
  getQuizResult,
} from "../controllers/submitQuizController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * User submits quiz
 */
router.post(
  "/webinars/:webinarId/quizzes/:quizId/submit",
  protect,
  authorizeRoles("user"),
  submitQuiz
);

/**
 * Admin views all submissions of a quiz
 */
router.get(
  "/quizzes/:quizId/submissions",
  protect,
  authorizeRoles("admin"),
  getAllSubmittedQuizzesByQuiz
);

/**
 * Admin views all submitted quizzes of a webinar
 */
router.get(
  "/webinars/:webinarId/quizzes/submissions",
  protect,
  authorizeRoles("admin"),
  getAllSubmittedQuizzesByWebinar
);

/**
 * User views quiz result
 */
router.get(
  "/quizzes/:quizId/result",
  protect,
  authorizeRoles("user"),
  getQuizResult
);


export default router;
