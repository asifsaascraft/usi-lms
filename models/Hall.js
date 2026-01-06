import mongoose from "mongoose";

const HallSchema = new mongoose.Schema(
  {
    conferenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conference",
      required: true,
    },
    hallName: {
      type: String,
      required: [true, "Hall Name is required"],
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

export default mongoose.models.Hall ||
  mongoose.model("Hall", HallSchema);
