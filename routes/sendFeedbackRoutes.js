// routes/sendFeedbackRoutes.js
import express from "express";
import {
  submitFeedback,
  getMyFeedbackByWebinar,
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
 * User gets own submitted feedback
 */
router.get(
  "/webinars/:webinarId/my-feedback",
  protect,
  authorizeRoles("user"),
  getMyFeedbackByWebinar
);


/**
 * views all submitted feedbacks (public)
 */
router.get(
  "/webinars/:webinarId/send-feedback",
  getAllSubmitFeedbacksByWebinar
);

export default router;
