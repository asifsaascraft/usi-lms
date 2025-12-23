// controllers/weekCategoryController.js
import WeekCategory from "../models/WeekCategory.js";
import Course from "../models/Course.js";

// =======================
// Create Week Category (admin)
// =======================
export const createWeekCategory = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { weekCategoryName, status } = req.body;

    // Validate course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const weekCategory = await WeekCategory.create({
      courseId,
      weekCategoryName,
      status,
    });

    res.status(201).json({
      success: true,
      data: weekCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create week category",
      error: error.message,
    });
  }
};

// =======================
// Get all week categories of a course (public)
// =======================
export const getWeekCategoriesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const categories = await WeekCategory.find({ courseId })
      .populate("courseId")
      .sort({
        createdAt: 1,
      });

    res.json({
      success: true,
      total: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch week categories",
      error: error.message,
    });
  }
};

// =======================
// Get active week categories of a course (public)
// =======================
export const getActiveWeekCategoriesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const categories = await WeekCategory.find({
      courseId,
      status: "Active",
    })
      .populate("courseId")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      total: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch active week categories",
      error: error.message,
    });
  }
};

// =======================
// Update week category (admin)
// =======================
export const updateWeekCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCategory = await WeekCategory.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Week category not found",
      });
    }

    res.json({
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update week category",
      error: error.message,
    });
  }
};

// =======================
// Delete week category (admin)
// =======================
export const deleteWeekCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await WeekCategory.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Week category not found",
      });
    }

    res.json({
      success: true,
      message: "Week category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete week category",
      error: error.message,
    });
  }
};
