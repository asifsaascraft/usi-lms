import mongoose from "mongoose";

/**
 * Objective answers (scale / yes-no)
 */
const SubmittedFeedbackSchema = new mongoose.Schema(
  {
    feedbackName: { type: String },
    selectedOption: { type: String },
  },
  { _id: false }
);

const SubmitPublicFeedbackSchema = new mongoose.Schema(
  {
    webinarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webinar",
      required: true,
    },

    /**
     * Participant fields dynamic
     * ex:
     * { Name: "Asif", Profession: "Doctor" }
     */
    participantAnswers: {
      type: Map,
      of: String,
      default: {},
    },

    /**
     * Objective answers
     */
    sendFeedbacks: {
      type: [SubmittedFeedbackSchema],
      default: [],
    },

    /**
     * Open ended answers
     */
    openEndedAnswers: {
      type: Map,
      of: String,
      default: {},
    },

    /**
     * Additional comment
     */
    sendOtherFeedback: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.SubmitPublicFeedback ||
  mongoose.model("SubmitPublicFeedback", SubmitPublicFeedbackSchema);
