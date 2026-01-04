import mongoose from "mongoose";

const WebinarSettingSchema = new mongoose.Schema(
  {
    webinarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webinar",
      required: true,
    },
    faculty: {
      type: Boolean,
      default: false,
    },
    faq: {
      type: Boolean,
      default: false,
    },
    feedback: {
      type: Boolean,
      default: false,
    },
    quiz: {
      type: Boolean,
      default: false,
    },
    meeting: {
      type: Boolean,
      default: false,
    },
    question: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.WebinarSetting ||
  mongoose.model("WebinarSetting", WebinarSettingSchema);
