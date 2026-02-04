import SupportData from "../models/SupportData.js";
import { generateSupportTicketNumber } from "../utils/generateSupportTicket.js";
import sendEmailWithTemplate from "../utils/sendEmail.js";

/* =======================
   Create Support Message
======================= */
export const createSupportMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email and message are required",
      });
    }

    let supportTicketNumber;
    let exists = true;

    while (exists) {
      supportTicketNumber = generateSupportTicketNumber();
      exists = await SupportData.exists({ supportTicketNumber });
    }

    await SupportData.create({
      name,
      email,
      message,
      supportTicketNumber,
      status: "OPEN",
      isRead: false,
    });

    res.status(201).json({
      message: "Support request submitted successfully",
      supportTicketNumber,
    });
  } catch (error) {
    console.error("Create support message error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =======================
   Get Support Messages
   ?status=OPEN|RESOLVED
======================= */
export const getAllSupportMessages = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) {
      filter.status = status.toUpperCase();
    }

    const messages = await SupportData.find(filter).sort({
      createdAt: -1,
    });

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

/* =======================
   Resolve Support Ticket
======================= */
export const resolveSupportMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await SupportData.findById(id);
    if (!ticket) {
      return res.status(404).json({
        message: "Support ticket not found",
      });
    }

    if (ticket.status === "RESOLVED") {
      return res.status(400).json({
        message: "Ticket already resolved",
      });
    }

    ticket.status = "RESOLVED";
    ticket.isRead = true;
    await ticket.save();

    res.status(200).json({
      message: "Support ticket resolved successfully",
    });
  } catch (error) {
    console.error("Resolve support message error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =======================
   Reply to Support Ticket
======================= */
export const replySupportMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage, markResolved = false } = req.body;

    if (!replyMessage) {
      return res.status(400).json({
        message: "Reply message is required",
      });
    }

    const ticket = await SupportData.findById(id);
    if (!ticket) {
      return res.status(404).json({
        message: "Support ticket not found",
      });
    }

    await sendEmailWithTemplate({
      to: ticket.email,
      name: ticket.name,
      templateKey: process.env.ZEPTO_SUPPORT_REPLY_TEMPLATE,
      mergeInfo: {
        TICKET_NUMBER: ticket.supportTicketNumber,
        REPLY_MESSAGE: replyMessage,
      },
    });

    if (markResolved) {
      ticket.status = "RESOLVED";
    }

    ticket.isRead = true;
    await ticket.save();

    res.status(200).json({
      message: "Reply sent successfully",
    });
  } catch (error) {
    console.error("Reply support message error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =======================
   Delete Support Ticket
======================= */
export const deleteSupportMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SupportData.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        message: "Support ticket not found",
      });
    }

    res.status(200).json({
      message: "Support ticket deleted successfully",
    });
  } catch (error) {
    console.error("Delete support message error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
