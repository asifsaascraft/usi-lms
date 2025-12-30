// routes/courseModuleRoutes.js
import express from "express";
import {
  getModulesByWeekCategory,
  getCourseWeeksWithModules,
  getCourseModuleById,
  createCourseModule,
  updateCourseModule,
  deleteCourseModule,
  markModuleAsChecked,
} from "../controllers/courseModuleController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * ============================
 * Public Routes
 * ============================
 */

// Get modules by week category
router.get(
  "/week-categories/:weekCategoryId/modules",
  getModulesByWeekCategory
);

// Get weeks with modules by course
router.get(
  "/courses/:courseId/weeks-with-modules",
  getCourseWeeksWithModules
);

// Get module by ID
router.get("/modules/:id", getCourseModuleById);

/**
 * ============================
 * Admin Routes
 * ============================
 */

// Create module
router.post(
  "/admin/courses/:courseId/week-categories/:weekCategoryId/modules",
  protect,
  authorizeRoles("admin"),
  createCourseModule
);

// Update module
router.put(
  "/admin/modules/:id",
  protect,
  authorizeRoles("admin"),
  updateCourseModule
);

// Delete module
router.delete(
  "/admin/modules/:id",
  protect,
  authorizeRoles("admin"),
  deleteCourseModule
);

/**
 * ============================
 * User Routes
 * ============================
 */

// Mark module as completed (checkbox true)
router.patch(
  "/modules/:id/check",
  protect, // user must be logged in
  authorizeRoles("user"),
  markModuleAsChecked
);

export default router;
