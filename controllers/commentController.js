// controllers/commentController.js
import Comment from "../models/Comment.js";
import Webinar from "../models/Webinar.js";

/**
 * =========================
 * POST comment (Authorized)
 * =========================
 */
export const addComment = async (req, res) => {
  try {
    const { webinarId } = req.params;
    const { userId, comment } = req.body;

    // Validate webinar
    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: "Webinar not found",
      });
    }

    // Create comment
    const newComment = await Comment.create({
      webinarId,
      userId,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: newComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add comment",
      error: error.message,
    });
  }
};

/**
 * ==================================
 * GET all comments by webinar (Public)
 * ==================================
 */
export const getCommentsByWebinar = async (req, res) => {
  try {
    const { webinarId } = req.params;

    const comments = await Comment.find({ webinarId })
      .populate("userId", "name email profilePicture") 
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: comments.length,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
};
