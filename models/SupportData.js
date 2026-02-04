import mongoose from "mongoose";

const SupportDataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },

    //  Support Ticket Number
    supportTicketNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    //  Status Lifecycle
    status: {
      type: String,
      enum: ["OPEN", "RESOLVED"],
      default: "OPEN",
    },

    //  Unread badge support
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.SupportData ||
  mongoose.model("SupportData", SupportDataSchema);