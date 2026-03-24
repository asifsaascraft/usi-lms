import express from "express";
import {
  createDisclaimer,
  getDisclaimer,
  updateDisclaimer,
  deleteDisclaimer,
} from "../controllers/disclaimerController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";



const router = express.Router();
// =======================
// Public Routes
// =======================

// GET (single)
router.get("/disclaimer", getDisclaimer);

// =======================
// Admin Routes
// =======================

// CREATE (only if not exists)
router.post("/admin/disclaimer",
  protect,
  authorizeRoles("admin"),
  createDisclaimer);

// UPDATE
router.put("/admin/disclaimer",
  protect,
  authorizeRoles("admin"),
  updateDisclaimer);

// DELETE
router.delete("/admin/disclaimer", protect,
  authorizeRoles("admin"),
  deleteDisclaimer);


export default router;