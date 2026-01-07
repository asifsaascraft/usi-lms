import mongoose from "mongoose";

const TrackSchema = new mongoose.Schema(
  {
    conferenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conference",
      required: true,
    },
    trackName: {
      type: String,
      required: [true, "Track Name is required"],
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

export default mongoose.models.Track ||
  mongoose.model("Track", TrackSchema);
