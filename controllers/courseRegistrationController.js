// controllers/courseRegistrationController.js

import CourseRegistration from "../models/CourseRegistration.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import { getPagination, buildPaginationMeta } from "../utils/pagination.js";

// ==============================
// Register user into course
// ==============================
export const registerToCourse = async (req, res) => {
  try {
    const { courseId, userId, email, mobile, membershipNumber } = req.body;

    // ------------------------------------
    // Validate required IDs
    // ------------------------------------
    if (!courseId || !userId) {
      return res.status(400).json({
        success: false,
        message: "courseId and userId are required",
      });
    }

    // Check course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Invalid courseId",
      });
    }

    // Check user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    // ------------------------------------
    // At least one identifier required
    // ------------------------------------
    if (!email && !mobile && !membershipNumber) {
      return res.status(400).json({
        success: false,
        message:
          "Must provide either email or mobile or membershipNumber to register",
      });
    }

    // ------------------------------------
    // Validate data against User record
    // ------------------------------------
    if (email && user.email !== email) {
      return res.status(400).json({
        success: false,
        message: "Email does not match with user",
      });
    }

    if (mobile && user.mobile !== mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile does not match with user",
      });
    }

    if (membershipNumber && user.membershipNumber !== membershipNumber) {
      return res.status(400).json({
        success: false,
        message: "Membership Number does not match with user",
      });
    }

    // ------------------------------------
    // Prevent duplicate registration
    // ------------------------------------
    const alreadyRegistered = await CourseRegistration.findOne({
      courseId,
      userId,
    });

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: "User already registered for this course",
      });
    }

    // ------------------------------------
    // Register now
    // ------------------------------------
    const newRegistration = await CourseRegistration.create({
      courseId,
      userId,
      email,
      mobile,
      membershipNumber,
    });

    return res.status(201).json({
      success: true,
      message: "Course registration successful",
      data: newRegistration,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Course registration failed",
      error: error.message,
    });
  }
};

// ==============================
// Get all courses registered by a user
// ==============================
export const getUserCourseRegistrations = async (req, res) => {
  try {
    const { userId } = req.params;

    const { page, limit, skip } = getPagination(req);

    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    const filter = { userId };

    const total = await CourseRegistration.countDocuments(filter);

    const registrations = await CourseRegistration.find(filter)
      .populate("courseId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const pagination = buildPaginationMeta(total, page, limit);

    return res.json({
      success: true,
      pagination,
      data: registrations.map((x) => ({
        id: x._id,
        course: x.courseId,
        registeredOn: x.createdAt,
        email: x.email,
        mobile: x.mobile,
        membershipNumber: x.membershipNumber,
      })),
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course registrations",
      error: error.message,
    });
  }
};

// ==============================
// Admin → Get all registrations of a course
// ==============================
export const getRegistrationsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const { page, limit, skip } = getPagination(req);

    // Validate course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Invalid courseId",
      });
    }

    const filter = { courseId };

    const total = await CourseRegistration.countDocuments(filter);

    const registrations = await CourseRegistration.find(filter)
      .populate("userId", "name email mobile prefix")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const pagination = buildPaginationMeta(total, page, limit);

    return res.json({
      success: true,
      course: {
        id: course._id,
        courseName: course.courseName,
      },
      pagination,
      data: registrations.map((r) => ({
        registrationId: r._id,
        registeredOn: r.createdAt,
        user: r.userId,
      })),
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch registrations",
      error: error.message,
    });
  }
};
