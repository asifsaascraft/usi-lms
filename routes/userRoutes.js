import express from "express";
import {
  getUserSession,
  registerUser,
  loginUser,
  verifyLoginOtp,
  refreshAccessTokenUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserStatus,
  deleteUser,
} from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { uploadUSIProfileImage } from "../middlewares/uploadMiddleware.js";
import { getMyAllRegistrations } from "../controllers/userRegistrationController.js";


const router = express.Router();


// =======================
// User Routes
// =======================

//  GET CURRENT USER SESSION (Protected)
router.get(
  "/me",
  protect,                // verifies access token
  authorizeRoles("user"),
  getUserSession 
);

// Public signup
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Verify OTP Login
router.post("/verify-otp", verifyLoginOtp);

// Refresh access token (GET, using cookies)
router.post("/refresh-token", refreshAccessTokenUser);

// Logout
router.post('/logout', logoutUser);

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

// =======================
// Get My All Registrations (Course + Webinar)
// =======================
router.get(
  "/registrations",
  protect,
  authorizeRoles("user"),
  getMyAllRegistrations
);

// Delete User – Admin only
router.delete(
  "/:userId",
  protect,
  authorizeRoles("admin"),
  deleteUser
)


export default router;
