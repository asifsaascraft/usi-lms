// routes/webinarRoutes.js
import express from "express";
import {
  getWebinars,
  getActiveWebinars,
  getUpcomingWebinars,
  getActiveWebinarById,
  getActiveUSIWebinars,
  getActiveSmartLearningWebinars,
  getActiveLiveWorkshops,
  getWebinarById,
  createWebinar,
  updateWebinar,
  deleteWebinar,
} from "../controllers/webinarController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { uploadWebinarFiles } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public: anyone can view all webinars
router.get("/webinars", getWebinars);

// Public: Get all active webinars
router.get("/webinars/active", getActiveWebinars);

// Public: Get Upcoming Webinars (All Types, Active only)
router.get("/webinars/upcoming", getUpcomingWebinars);

// Public: Get active webinar BY ID
router.get("/webinars/active/:id", getActiveWebinarById);

// Get Active USI Webinars
router.get("/webinars/usi/active", getActiveUSIWebinars);

// Get Active Smart Learning Webinars
router.get("/webinars/smart-learning/active", getActiveSmartLearningWebinars);

// Get Active Live Workshop Webinars
router.get("/webinars/live-workshops/active", getActiveLiveWorkshops);

// Public: Get webinar BY ID
router.get("/webinars/:id", getWebinarById);

// Admin-only: Create a new webinar
router.post(
  "/admin/webinars",
  protect,
  authorizeRoles("admin"),
  uploadWebinarFiles.fields([
    { name: "image", maxCount: 1 },
    { name: "brochureUpload", maxCount: 1 },
  ]),
  createWebinar
);

// Admin-only: Update a webinar
router.put(
  "/admin/webinars/:id",
  protect,
  authorizeRoles("admin"),
  uploadWebinarFiles.fields([
    { name: "image", maxCount: 1 },
    { name: "brochureUpload", maxCount: 1 },
  ]),
  updateWebinar
);

// Admin-only: Delete a webinar
router.delete(
  "/admin/webinars/:id",
  protect,
  authorizeRoles("admin"),
  deleteWebinar
);

export default router;
