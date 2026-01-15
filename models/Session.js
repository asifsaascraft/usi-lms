import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    conferenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conference",
      required: true,
    },
    sessionName: {
      type: String,
      required: [true, "Session Name is required"],
    },
    chairperson: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Speaker",
      required: [true, "Chairperson Name is required"],
    }],
    sessionDate: {
      type: String, // Format: DD/MM/YYYY
      required: [true, "Session Date is required"],
    },
    hallId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hall",
      required: true,
    },
    trackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Track",
      required: true,
    },
    startTime: {
      type: String, // Format: hh:mm A (e.g., 09:00 AM)
      required: [true, "Start Time is required"],
    },
    endTime: {
      type: String, // Format: hh:mm A (e.g., 05:00 PM)
      required: [true, "End Time is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Session ||
  mongoose.model("Session", SessionSchema);
