import mongoose from "mongoose";

const DisclaimerSchema = new mongoose.Schema(
  {
    disclaimerName: {
      type: String,
      required: [true, "Disclaimer is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Disclaimer ||
  mongoose.model("Disclaimer", DisclaimerSchema);
