// routes/weekCategoryRoutes.js
import express from "express";
import {
  createWeekCategory,
  getWeekCategoriesByCourse,
  getActiveWeekCategoriesByCourse,
  updateWeekCategory,
  deleteWeekCategory,
} from "../controllers/weekCategoryController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get(
  "/courses/:courseId/week-categories",
  getWeekCategoriesByCourse
);

router.get(
  "/courses/:courseId/week-categories/active",
  getActiveWeekCategoriesByCourse
);

// Admin
router.post(
  "/admin/courses/:courseId/week-categories",
  protect,
  authorizeRoles("admin"),
  createWeekCategory
);

router.put(
  "/admin/week-categories/:id",
  protect,
  authorizeRoles("admin"),
  updateWeekCategory
);

router.delete(
  "/admin/week-categories/:id",
  protect,
  authorizeRoles("admin"),
  deleteWeekCategory
);

export default router;
