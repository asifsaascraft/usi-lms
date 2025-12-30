// controllers/courseModuleController.js
import CourseModule from "../models/CourseModule.js";
import Course from "../models/Course.js";
import WeekCategory from "../models/WeekCategory.js";

/**
 * ============================
 * Get all modules by week category (Public)
 * ============================
 */
export const getModulesByWeekCategory = async (req, res) => {
  try {
    const { weekCategoryId } = req.params;

    const modules = await CourseModule.find({ weekCategoryId })
      .populate("courseId", "courseName")
      .populate("weekCategoryId", "weekCategoryName")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      total: modules.length,
      data: modules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch course modules",
      error: error.message,
    });
  }
};

/**
 * ============================
 * Get course weeks with modules by course (Public)
 * ============================
 */
export const getCourseWeeksWithModules = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate course
    const course = await Course.findById(courseId).select("courseName");
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Fetch week categories
    const weekCategories = await WeekCategory.find({ courseId }).sort({
      createdAt: 1,
    });

    // Fetch modules
    const modules = await CourseModule.find({ courseId }).sort({
      createdAt: 1,
    });

    // Group modules by week
    const data = weekCategories.map((week) => ({
      _id: week._id,
      weekCategoryName: week.weekCategoryName,
      modules: modules.filter(
        (m) => m.weekCategoryId.toString() === week._id.toString()
      ),
    }));

    res.json({
      success: true,
      course,
      totalWeeks: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch course weeks and modules",
      error: error.message,
    });
  }
};

/**
 * ============================
 * Get course module by ID (Public)
 * ============================
 */
export const getCourseModuleById = async (req, res) => {
  try {
    const { id } = req.params;

    const module = await CourseModule.findById(id)
      .populate("courseId", "courseName")
      .populate("weekCategoryId", "weekCategoryName");

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Course module not found",
      });
    }

    res.json({
      success: true,
      data: module,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch course module",
      error: error.message,
    });
  }
};

/**
 * ============================
 * Create course module (Admin)
 * ============================
 */
export const createCourseModule = async (req, res) => {
  try {
    const { courseId, weekCategoryId } = req.params;

    const {
      topicName,
      contentType,
      aboutTopic,
      contentUrl,
      videoDuration,
      additionalQuestions,
      additionalResources,
      isCheckBox,
    } = req.body;

    // Validate course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Validate week category
    const weekCategory = await WeekCategory.findOne({
      _id: weekCategoryId,
      courseId,
    });

    if (!weekCategory) {
      return res.status(404).json({
        success: false,
        message: "Week category not found for this course",
      });
    }

    const module = await CourseModule.create({
      courseId,
      weekCategoryId,
      topicName,
      contentType,
      aboutTopic,
      contentUrl,
      videoDuration,
      additionalQuestions,
      additionalResources,
      isCheckBox: Boolean(isCheckBox),
    });

    res.status(201).json({
      success: true,
      data: module,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create course module",
      error: error.message,
    });
  }
};

/**
 * ============================
 * Update course module (Admin)
 * ============================
 */
export const updateCourseModule = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedModule = await CourseModule.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedModule) {
      return res.status(404).json({
        success: false,
        message: "Course module not found",
      });
    }

    res.json({
      success: true,
      data: updatedModule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update course module",
      error: error.message,
    });
  }
};

/**
 * ============================
 * Delete course module (Admin)
 * ============================
 */
export const deleteCourseModule = async (req, res) => {
  try {
    const { id } = req.params;

    const module = await CourseModule.findByIdAndDelete(id);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Course module not found",
      });
    }

    res.json({
      success: true,
      message: "Course module deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete course module",
      error: error.message,
    });
  }
};

/**
 * ============================
 * Mark module as completed (User)
 * ============================
 */
export const markModuleAsChecked = async (req, res) => {
  try {
    const { id } = req.params;

    const module = await CourseModule.findById(id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Course module not found",
      });
    }

    // Only update isCheckBox
    module.isCheckBox = true;
    await module.save();

    res.json({
      success: true,
      message: "Module marked as completed",
      data: {
        _id: module._id,
        isCheckBox: module.isCheckBox,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update module status",
      error: error.message,
    });
  }
};

