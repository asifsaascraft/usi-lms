// routes/courseModuleRoutes.js
import express from "express";
import {
  getModulesByWeekCategory,
  getActiveModulesByWeekCategory,
  getCourseWeeksWithModules,
  createCourseModule,
  updateCourseModule,
  deleteCourseModule,
} from "../controllers/courseModuleController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get(
  "/week-categories/:weekCategoryId/modules",
  getModulesByWeekCategory
);

router.get(
  "/week-categories/:weekCategoryId/modules/active",
  getActiveModulesByWeekCategory
);

router.get(
  "/courses/:courseId/weeks-with-modules",
  getCourseWeeksWithModules
);

// Admin
router.post(
  "/admin/courses/:courseId/week-categories/:weekCategoryId/modules",
  protect,
  authorizeRoles("admin"),
  createCourseModule
);

router.put(
  "/admin/modules/:id",
  protect,
  authorizeRoles("admin"),
  updateCourseModule
);

router.delete(
  "/admin/modules/:id",
  protect,
  authorizeRoles("admin"),
  deleteCourseModule
);

export default router;
