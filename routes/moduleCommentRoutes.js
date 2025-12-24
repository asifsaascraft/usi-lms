// routes/moduleCommentRoutes.js
import express from "express";
import {
  addModuleComment,
  getModuleComments,
} from "../controllers/moduleCommentController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Public – Get comments of a course module
 */
router.get(
  "/courses/:courseId/modules/:courseModuleId/comments",
  getModuleComments
);

/**
 * Authorized user – Add module comment
 */
router.post(
  "/courses/:courseId/modules/:courseModuleId/comments",
  protect,
  authorizeRoles("user"),
  addModuleComment
);

export default router;
