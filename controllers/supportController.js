import SupportData from "../models/SupportData.js";

/* =======================
   Create Support Message
   (Public)
======================= */
export const createSupportMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email and message are required",
      });
    }

    // Check if email already exists (because unique: true)
    const existing = await SupportData.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: "Support request already submitted with this email",
      });
    }

    const supportData = await SupportData.create({
      name,
      email,
      message,
    });

    res.status(201).json({
      message: "Support request submitted successfully",
      data: supportData,
    });
  } catch (error) {
    console.error("Create support message error:", error);

    // Handle duplicate key error (MongoDB unique index)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Support request already exists for this email",
      });
    }

    res.status(500).json({ message: "Server Error" });
  }
};

/* =======================
   Get All Support Messages
   (Public)
======================= */
export const getAllSupportMessages = async (req, res) => {
  try {
    const messages = await SupportData.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Support messages fetched successfully",
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error("Get support messages error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
