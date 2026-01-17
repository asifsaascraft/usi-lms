import mongoose from "mongoose";

const SubmitPublicFeedbackSchema = new mongoose.Schema(
  {
    webinarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webinar",
      required: true,
    },
    
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
  
    submitPublicFeedbacks: [
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

export default mongoose.models.SubmitPublicFeedback ||
  mongoose.model("SubmitPublicFeedback", SubmitPublicFeedbackSchema);
