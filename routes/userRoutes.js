import express from "express";
import cookieParser from "cookie-parser";
import {
  registerUser,
  loginUser,
  refreshAccessTokenUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserStatus,
} from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { uploadUSIProfileImage } from "../middlewares/uploadMiddleware.js";

const router = express.Router();


// Middleware to parse cookies
router.use(cookieParser());

// =======================
// User Routes
// =======================

// Public signup
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Refresh access token (GET, using cookies)
router.get("/refresh-token", refreshAccessTokenUser);

// Logout - User only
router.post(
  "/logout",
  protect, // ensures user is logged in
  authorizeRoles("user"), // user-only
  logoutUser
);

// Get User Profile - User only
router.get(
  "/profile",
  protect, // ensures user is logged in
  authorizeRoles("user"), // user-only
  getUserProfile
);

// Update User Profile - User only
router.put(
  "/profile",
  protect, // ensures user is logged in
  authorizeRoles("user"), // user-only
  uploadUSIProfileImage.single("profilePicture"), // handles profile image upload
  updateUserProfile
);

// Get all users – Admin only
router.get(
  "/all",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);

// Update User Status – Admin only
router.put(
  "/status/:userId",
  protect,
  authorizeRoles("admin"),
  updateUserStatus
);


export default router;
