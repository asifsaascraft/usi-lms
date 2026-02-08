import express from "express";
import {
  registerToWebinar,
  getUserWebinarRegistrations,
  getWebinarRegistrationsForAdminSimple,
  getAllWebinarRegistrations,
  getAttendedUsers,
  getNotAttendedUsers,
} from "../controllers/webinarRegistrationController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Register user to webinar
router.post(
  "/webinar/register",
  protect,
  authorizeRoles("user"),
  registerToWebinar
);

// Get all registrations for a particular user
router.get(
  "/webinar/registrations/:userId",
  protect,
  authorizeRoles("user"),
  getUserWebinarRegistrations
);

// Admin
// Get all registrations for particular Webinar Simple response
router.get(
  "/admin/webinar/:webinarId/registrations-simple",
  protect,
  authorizeRoles("admin"),
  getWebinarRegistrationsForAdminSimple
);

// Admin
// Get all registrations for particular Webinar
router.get(
  "/admin/webinar/:webinarId/registrations",
  protect,
  authorizeRoles("admin"),
  getAllWebinarRegistrations
);

// Attended users
router.get(
  "/admin/webinar/:webinarId/attended",
  protect,
  authorizeRoles("admin"),
  getAttendedUsers
);

// Not attended users
router.get(
  "/admin/webinar/:webinarId/not-attended",
  protect,
  authorizeRoles("admin"),
  getNotAttendedUsers
);

export default router;
