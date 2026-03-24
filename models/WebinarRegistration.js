import mongoose from "mongoose";

const WebinarRegistrationSchema = new mongoose.Schema(
  {
    webinarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webinar",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
    },
    mobile: {
      type: String,
    },
    membershipNumber: {
      type: String,
    },
    disclaimer: {
      type: Boolean,
      default: false,
    },
    // Attendance Tracking
    attended: {
      type: Boolean,
      default: false,
    },
    attendedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.WebinarRegistration ||
  mongoose.model("WebinarRegistration", WebinarRegistrationSchema);
