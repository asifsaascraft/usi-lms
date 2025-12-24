import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(
  {
    webinarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webinar",
      required: true,
    },
    quizQuestions: [
      {
        questionName: {
          type: String,
          required: [true, "Question Name is required"],
        },
        correctAnswer: {
          type: String,
          required: [true, "Answer is required"],
        },
        options: {
          type: [String],
          default: [],
        },
      },
    ],
    quizduration: {
      type: String,
      required: [true, "Duration Time is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
