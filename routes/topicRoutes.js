// routes/topicRoutes.js
import express from "express";
import {
  createTopic,
  updateTopic,
  deleteTopic,
  getTopicsByConference,
  getTopicsByConferenceBySession,
  getTopicById,
} from "../controllers/topicController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// =======================
// Admin Routes
// =======================
router.post(
  "/admin/conferences/:conferenceId/topics",
  protect,
  authorizeRoles("admin"),
  createTopic
);

router.put(
  "/admin/topics/:id",
  protect,
  authorizeRoles("admin"),
  updateTopic
);

router.delete(
  "/admin/topics/:id",
  protect,
  authorizeRoles("admin"),
  deleteTopic
);

// =======================
// GET Routes (Public – your choice)
// =======================

// Get all topics by conference
router.get(
  "/conferences/:conferenceId/topics",
  getTopicsByConference
);

// Get topics by conference & session
router.get(
  "/conferences/:conferenceId/sessions/:sessionId/topics",
  getTopicsByConferenceBySession
);

// Get topic by topic ID
router.get(
  "/topics/:id",
  getTopicById
);

export default router;
