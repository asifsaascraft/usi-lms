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
    topicName: {
      type: String,
      required: [true, "Topic Name is required"],
    },
    contentType: {
      type: String,
      enum: ["video", "image", "document"],
      required: [true, "Content Type is required"],
    },
    aboutTopic: {
      type: String,
    },
    contentUrl: {
      type: String,
      required: [true, "Content link is required"],
    },
    videoDuration: {
      type: String,
    },
    additionalQuestions: {
      type: [String],
      default: [],
    },
    additionalResources: {
      type: [String],
      default: [],
    },
    isCheckBox: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.CourseModule ||
  mongoose.model("CourseModule", CourseModuleSchema);