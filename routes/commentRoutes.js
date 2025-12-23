// routes/commentRoutes.js
import express from "express";
import {
  addComment,
  getCommentsByWebinar,
} from "../controllers/commentController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public: Get all comments of a webinar
router.get("/webinars/:webinarId/comments", getCommentsByWebinar);

// Authorized user: Add comment
router.post(
  "/webinars/:webinarId/comments",
  protect,
  authorizeRoles("user"),
  addComment
);

export default router;
