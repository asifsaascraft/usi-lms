import mongoose from "mongoose";

const SupportDataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.SupportData ||
  mongoose.model("SupportData", SupportDataSchema);
