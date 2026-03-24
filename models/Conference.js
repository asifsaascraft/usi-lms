import mongoose from "mongoose";

// Schema
const ConferenceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    venueName: {
      type: String,
    },
    image: {
      type: String, // store file path or URL
      required: [true, "Image is required"],
    },
    description: {
      type: String,
    },
    conferenceType: {
      type: String,
      enum: ["Virtual", "Physical"],
      required: [true, "Conference Type is required"],
    },
    startDate: {
      type: String, // Format: DD/MM/YYYY
      required: [true, "Start Date is required"],
    },
    endDate: {
      type: String, // Format: DD/MM/YYYY
      required: [true, "End Date is required"],
    },
    timeZone: {
      type: String, // e.g., "Asia/Kolkata"
      required: [true, "Time Zone is required"],
    },
    registrationType: {
      type: String,
      enum: ["paid", "free"],
      required: [true, "Registration Type is required"],
    },
    amount: {
      type: Number,
      default: 0,
    },
    disclaimer: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"], //  restricts to these values
      default: "Inactive",
      required: [true, "Status is required"],
    },
    // status removed from schema because we calculate it dynamically
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

/**
 *  Auto set amount = 0 when registrationType = free
 */
ConferenceSchema.pre("save", function (next) {
  if (this.registrationType === "free") {
    this.amount = 0;
  }
  next();
});

/**
 *  Auto set amount = 0 when updating a webinar
 */
ConferenceSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.registrationType === "free") {
    update.amount = 0;
  }

  next();
});


// Avoid model overwrite during hot-reload
export default mongoose.models.Conference ||
  mongoose.model("Conference", ConferenceSchema);

