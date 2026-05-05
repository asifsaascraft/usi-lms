import express from "express";
import {
  createFlyer,
  getFlyer,
  updateFlyer,
  deleteFlyer,
} from "../controllers/flyerController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { uploadFlyerImage } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// =======================
// PUBLIC
// =======================
router.get("/flyer", getFlyer);

// =======================
// ADMIN
// =======================
router.post(
  "/admin/flyer",
  protect,
  authorizeRoles("admin"),
  uploadFlyerImage.single("flyerImage"),
  createFlyer
);

router.put(
  "/admin/flyer",
  protect,
  authorizeRoles("admin"),
  uploadFlyerImage.single("flyerImage"),
  updateFlyer
);

router.delete(
  "/admin/flyer",
  protect,
  authorizeRoles("admin"),
  deleteFlyer
);

export default router;