// routes/sendFeedbackRoutes.js
import express from "express";
import {
  submitFeedback,
  getAllSubmitFeedbacksByWebinar,
} from "../controllers/sendFeedbackController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * User submits feedback
 */
router.post(
  "/webinars/:webinarId/send-feedback",
  protect,
  authorizeRoles("user"),
  submitFeedback
);

/**
 * Admin views all submitted feedbacks
 */
router.get(
  "/webinars/:webinarId/send-feedback",
  protect,
  authorizeRoles("admin"),
  getAllSubmitFeedbacksByWebinar
);

export default router;
