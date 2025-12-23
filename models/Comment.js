import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
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
    comment: {
      type: String,
      required: [true, "Comment is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Comment ||
  mongoose.model("Comment", CommentSchema);
