// routes/askedQAndARoutes.js
import express from "express";
import {
  createAskedQAndA,
  getAskedQAndAByWebinar,
  updateAskedQAndA,
  deleteAskedQAndA,
} from "../controllers/askedQAndAController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Public
 */
router.get(
  "/webinars/:webinarId/qna",
  getAskedQAndAByWebinar
);

/**
 * Admin only
 */
router.post(
  "/webinars/:webinarId/qna",
  protect,
  authorizeRoles("admin"),
  createAskedQAndA
);

router.put(
  "/webinars/:webinarId/qna",
  protect,
  authorizeRoles("admin"),
  updateAskedQAndA
);

router.delete(
  "/webinars/:webinarId/qna",
  protect,
  authorizeRoles("admin"),
  deleteAskedQAndA
);

export default router;
