import mongoose from "mongoose";

const SubmitQuizSchema = new mongoose.Schema(
  {
    webinarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webinar",
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true, // refers to Quiz.quizQuestions._id
        },
        questionName: {
          type: String, // optional (snapshot for history)
        },
        selectedOption: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);


export default mongoose.models.SubmitQuiz ||
  mongoose.model("SubmitQuiz", SubmitQuizSchema);
