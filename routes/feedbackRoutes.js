// routes/feedbackRoutes.js
import express from "express";
import {
  createFeedback,
  getFeedbackByWebinar,
  updateFeedback,
  deleteFeedback,
} from "../controllers/feedbackController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Public
 */
router.get(
  "/webinars/:webinarId/feedback",
  getFeedbackByWebinar
);

/**
 * Admin only
 */
router.post(
  "/webinars/:webinarId/feedback",
  protect,
  authorizeRoles("admin"),
  createFeedback
);

router.put(
  "/webinars/:webinarId/feedback",
  protect,
  authorizeRoles("admin"),
  updateFeedback
);

router.delete(
  "/webinars/:webinarId/feedback",
  protect,
  authorizeRoles("admin"),
  deleteFeedback
);

export default router;
