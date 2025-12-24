import mongoose from "mongoose";

const AskedQAndASchema = new mongoose.Schema(
  {
    webinarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webinar",
      required: true,
    },
     questionsAndAnswers: [
      {
        question: {
          type: String,
          required: [true, "Question is required"],
        },
        answer: {
          type: String,
          required: [true, "Answer is required"],
        },
        
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.AskedQAndA ||
  mongoose.model("AskedQAndA", AskedQAndASchema);
