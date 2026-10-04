import mongoose from "mongoose";

const FlyerSchema = new mongoose.Schema(
  {
    flyerImage: {
      type: String, // store file path or URL
      required: [true, "Flyer image is required"],
    },
    flyerType: {
      type: String,
      enum: ["conference", "elearnings", "program", "webinar", "workshop"], //  restricts to these values
      default: "program",
      required: [true, "Flyer type is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Flyer ||
  mongoose.model("Flyer", FlyerSchema);
