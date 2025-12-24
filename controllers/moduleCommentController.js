// controllers/moduleCommentController.js
import ModuleComment from "../models/ModuleComment.js";
import Course from "../models/Course.js";
import CourseModule from "../models/CourseModule.js";

/**
 * ===========================
 * POST module comment (Auth)
 * ===========================
 * POST /courses/:courseId/modules/:courseModuleId/comments
 */
export const addModuleComment = async (req, res) => {
  try {
    const { courseId, courseModuleId } = req.params;
    const { weekCategoryId, userId, comment } = req.body;

    // Validate course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Validate module
    const module = await CourseModule.findOne({
      _id: courseModuleId,
      courseId,
      weekCategoryId,
    });

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Course module not found",
      });
    }

    // Create comment
    const newComment = await ModuleComment.create({
      courseId,
      weekCategoryId,
      courseModuleId,
      userId,
      comment,
    });

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: newComment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add module comment",
      error: error.message,
    });
  }
};

/**
 * =========================================
 * GET comments by course module (Public)
 * =========================================
 * GET /courses/:courseId/modules/:courseModuleId/comments
 */
export const getModuleComments = async (req, res) => {
  try {
    const { courseId, courseModuleId } = req.params;

    const comments = await ModuleComment.find({
      courseId,
      courseModuleId,
    })
      .populate("userId", "name email profilePicture")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      total: comments.length,
      data: comments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch module comments",
      error: error.message,
    });
  }
};
