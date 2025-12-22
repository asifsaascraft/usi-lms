import express from "express";
import {
  registerToWebinar,
  getUserWebinarRegistrations,
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

// Get registrations for one user
router.get(
  "/webinar/registrations/:userId",
  protect,
  authorizeRoles("user"),
  getUserWebinarRegistrations
);

export default router;
