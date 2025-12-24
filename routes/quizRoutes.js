// routes/quizRoutes.js
import express from "express";
import {
  createQuiz,
  getQuizzesByWebinar,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} from "../controllers/quizController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * ==============================
 * Public Routes
 * ==============================
 */

// Get all quizzes of a webinar
router.get(
  "/webinars/:webinarId/quizzes",
  getQuizzesByWebinar
);

// Get single quiz
router.get(
  "/quizzes/:quizId",
  getQuizById
);

/**
 * ==============================
 * Admin Routes
 * ==============================
 */

// Create quiz
router.post(
  "/webinars/:webinarId/quizzes",
  protect,
  authorizeRoles("admin"),
  createQuiz
);

// Update quiz
router.put(
  "/quizzes/:quizId",
  protect,
  authorizeRoles("admin"),
  updateQuiz
);

// Delete quiz
router.delete(
  "/quizzes/:quizId",
  protect,
  authorizeRoles("admin"),
  deleteQuiz
);

export default router;
