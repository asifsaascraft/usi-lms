import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    webinarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webinar",
      required: true,
    },

    feedbacks: [
      {
        feedbackName: {
          type: String,
          required: [true, "FeedBack Name is required"],
        },
        options: {
          type: [String],
          default: [],
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Feedback ||
  mongoose.model("Feedback", FeedbackSchema);
