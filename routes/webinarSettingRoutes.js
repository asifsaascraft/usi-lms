// routes/webinarSettingRoutes.js
import express from "express";
import {
  createWebinarSetting,
  getWebinarSettingByWebinar,
  getAllWebinarSettings,
  updateWebinarSetting,
  deleteWebinarSetting,
} from "../controllers/webinarSettingController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * ======================
 * Public
 * ======================
 */
router.get(
  "/webinars/:webinarId/settings",
  getWebinarSettingByWebinar
);

/**
 * ======================
 * Admin
 * ======================
 */
router.get(
  "/admin/webinar-settings",
  protect,
  authorizeRoles("admin"),
  getAllWebinarSettings
);

router.post(
  "/admin/webinars/:webinarId/settings",
  protect,
  authorizeRoles("admin"),
  createWebinarSetting
);

router.put(
  "/admin/webinars/:webinarId/settings",
  protect,
  authorizeRoles("admin"),
  updateWebinarSetting
);

router.delete(
  "/admin/webinars/:webinarId/settings",
  protect,
  authorizeRoles("admin"),
  deleteWebinarSetting
);

export default router;
