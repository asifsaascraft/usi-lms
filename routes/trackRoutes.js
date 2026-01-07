// routes/trackRoutes.js
import express from "express";
import {
  createTrack,
  getTracksByConference,
  getActiveTracksByConference,
  updateTrack,
  deleteTrack,
} from "../controllers/trackController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// =======================
// Public Routes
// =======================
router.get(
  "/conferences/:conferenceId/tracks",
  getTracksByConference
);

router.get(
  "/conferences/:conferenceId/tracks/active",
  getActiveTracksByConference
);

// =======================
// Admin Routes
// =======================
router.post(
  "/admin/conferences/:conferenceId/tracks",
  protect,
  authorizeRoles("admin"),
  createTrack
);

router.put(
  "/admin/tracks/:id",
  protect,
  authorizeRoles("admin"),
  updateTrack
);

router.delete(
  "/admin/tracks/:id",
  protect,
  authorizeRoles("admin"),
  deleteTrack
);

export default router;
