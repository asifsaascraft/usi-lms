// routes/sessionRoutes.js
import express from "express";
import {
  createSession,
  getSessionsByConference,
  getSessionsByDate,
  updateSession,
  deleteSession,
} from "../controllers/sessionController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// =======================
// Public Routes
// =======================
router.get(
  "/conferences/:conferenceId/sessions",
  getSessionsByConference
);

router.get(
  "/conferences/:conferenceId/sessions/date/:date",
  getSessionsByDate
);

// =======================
// Admin Routes
// =======================
router.post(
  "/admin/conferences/:conferenceId/sessions",
  protect,
  authorizeRoles("admin"),
  createSession
);

router.put(
  "/admin/sessions/:id",
  protect,
  authorizeRoles("admin"),
  updateSession
);

router.delete(
  "/admin/sessions/:id",
  protect,
  authorizeRoles("admin"),
  deleteSession
);

export default router;
