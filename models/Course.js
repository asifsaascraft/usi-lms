// models/Event.js
import mongoose from "mongoose";
import moment from "moment-timezone";

// Schema
const CourseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "Name is required"],
    },
    courseImage: {
      type: String, // store file path or URL
      required: [true, "Image is required"],
    },
    startDate: {
      type: String, // Format: DD/MM/YYYY
      required: [true, "Start Date is required"],
    },
    endDate: {
      type: String, // Format: DD/MM/YYYY
      required: [true, "End Date is required"],
    },
    startTime: {
      type: String, // Format: hh:mm A (e.g., 09:00 AM)
      required: [true, "Start Time is required"],
    },
    endTime: {
      type: String, // Format: hh:mm A (e.g., 05:00 PM)
      required: [true, "End Time is required"],
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
    status: {
      type: String,
      enum: ["Active", "Inactive"], //  restricts to these values
      default: "Active",
      required: [true, "Status is required"],
    },
    streamLink: {
      type: String,
      required: [true, "Stream Link is required"],
    },
    description: {
      type: String,
    },
    
    // status removed from schema because we calculate it dynamically
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

/**
 *  Auto set amount = 0 when registrationType = free
 */
CourseSchema.pre("save", function (next) {
  if (this.registrationType === "free") {
    this.amount = 0;
  }
  next();
});

/**
 *  Auto set amount = 0 when updating a webinar
 */
CourseSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.registrationType === "free") {
    update.amount = 0;
  }

  next();
});

/**
 * Virtual: Dynamic event status
 */
CourseSchema.virtual("dynamicStatus").get(function () {
  const tz = this.timeZone || "UTC";

  const start = moment.tz(
    `${this.startDate} ${this.startTime}`,
    "DD/MM/YYYY hh:mm A",
    tz
  );

  const end = moment.tz(
    `${this.endDate} ${this.endTime}`,
    "DD/MM/YYYY hh:mm A",
    tz
  );

  const now = moment.tz(tz);

  if (now.isBefore(start)) return "Upcoming";
  if (now.isBetween(start, end, null, "[]")) return "Live";
  return "Past";
});

// Avoid model overwrite during hot-reload
export default mongoose.models.Course ||
  mongoose.model("Course", CourseSchema);

