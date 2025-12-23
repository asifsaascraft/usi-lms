// routes/courseRoutes.js
import express from "express";
import {
  getCourses,
  getActiveCourses,
  getActiveCourseById,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { uploadCourseImage } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public
router.get("/courses", getCourses);
router.get("/courses/active", getActiveCourses);
router.get("/courses/active/:id", getActiveCourseById);
router.get("/courses/:id", getCourseById);

// Admin
router.post(
  "/admin/courses",
  protect,
  authorizeRoles("admin"),
  uploadCourseImage.single("courseImage"),
  createCourse
);

router.put(
  "/admin/courses/:id",
  protect,
  authorizeRoles("admin"),
  uploadCourseImage.single("courseImage"),
  updateCourse
);

router.delete(
  "/admin/courses/:id",
  protect,
  authorizeRoles("admin"),
  deleteCourse
);

export default router;
