// controllers/courseController.js
import Course from "../models/Course.js";

// =======================
// Get all courses (public)
// =======================
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses.map((c) => c.toObject({ virtuals: true })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

// =======================
// Get all active courses (public)
// =======================
export const getActiveCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "Active" }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: courses.map((c) => c.toObject({ virtuals: true })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch active courses",
      error: error.message,
    });
  }
};

// =======================
// Get active course by ID (public)
// =======================
export const getActiveCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findOne({ _id: id, status: "Active" });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Active course not found",
      });
    }

    res.json({
      success: true,
      data: course.toObject({ virtuals: true }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch active course",
      error: error.message,
    });
  }
};

// =======================
// Get single course (public)
// =======================
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.json({
      success: true,
      data: course.toObject({ virtuals: true }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: error.message,
    });
  }
};

// =======================
// Create course (admin only)
// =======================
export const createCourse = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Course image is required",
      });
    }

    const courseData = {
      ...req.body,
      courseImage: req.file.location,
    };

    const newCourse = await Course.create(courseData);

    res.status(201).json({
      success: true,
      data: newCourse.toObject({ virtuals: true }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// =======================
// Update course (admin only)
// =======================
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedData = { ...req.body };
    if (req.file) updatedData.courseImage = req.file.location;

    const updatedCourse = await Course.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.json({
      success: true,
      data: updatedCourse.toObject({ virtuals: true }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};

// =======================
// Delete course (admin only)
// =======================
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};
