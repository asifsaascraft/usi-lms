import mongoose from "mongoose";

const CourseRegistrationSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
    },
    mobile: {
      type: String,
    },
    membershipNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.CourseRegistration ||
  mongoose.model("CourseRegistration", CourseRegistrationSchema);