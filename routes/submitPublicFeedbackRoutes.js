import express from "express";
import {
  submitPublicFeedback,
  getAllPublicFeedbacksByWebinar,
} from "../controllers/submitPublicFeedbackController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Public submits feedback (No Auth)
 */
router.post(
  "/webinars/:webinarId/public-feedback",
  submitPublicFeedback
);

/**
 * Admin views all public submitted feedbacks
 */
router.get(
  "/webinars/:webinarId/public-feedback",
  protect,
  authorizeRoles("admin"),
  getAllPublicFeedbacksByWebinar
);

export default router;
