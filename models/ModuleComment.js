import mongoose from "mongoose";

const ModuleCommentSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    weekCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WeekCategory",
      required: true,
    },
    courseModuleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseModule",
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

export default mongoose.models.ModuleComment ||
  mongoose.model("ModuleComment", ModuleCommentSchema);
