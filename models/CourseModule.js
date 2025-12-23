import mongoose from "mongoose";

const CourseModuleSchema = new mongoose.Schema(
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
    courseModuleName: {
      type: String,
      required: [true, "Module Name is required"],
    },
    contentType: {
      type: String,
      required: [true, "Content Type is required"],
    },
    contentLink: {
      type: String,
      required: [true, "Content link is required"],
    },
    duration: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"], //  restricts to these values
      default: "Active",
      required: [true, "Status is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.CourseModule ||
  mongoose.model("CourseModule", CourseModuleSchema);