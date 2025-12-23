import mongoose from "mongoose";

const WeekCategorySchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    weekCategoryName: {
      type: String,
      required: [true, "Week Category Name is required"],
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

export default mongoose.models.WeekCategory ||
  mongoose.model("WeekCategory", WeekCategorySchema);