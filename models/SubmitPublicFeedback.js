import mongoose from "mongoose";

const SendFeedbackSchema = new mongoose.Schema(
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
  
    sendFeedbacks: [
      {
        feedbackId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true, // refers to Feedback.feedbacks._id
        },

        feedbackName: {
          type: String, // optional, for readability
        },

        selectedOption: {
          type: String, // RADIO → single selected value
          required: true,
        },
      },
    ],

    sendOtherFeedback: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.SendFeedback ||
  mongoose.model("SendFeedback", SendFeedbackSchema);
