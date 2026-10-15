
import mongoose from "mongoose";

const PanelPersonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    contact: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  { _id: false },
);

const FacultyInvitationSchema = new mongoose.Schema(
  {
    invitationType: {
      type: String,
      enum: [
        "WORKSHOP",
        "SOLO_TALK",
        "SOLO_TALK_ALL_COMPLIMENTARY",
        "PANELIST",
        "MODERATOR",
      ],
      required: true,
    },

    group: {
      type: String,
      enum: ["MP", "OUT_OF_MP", "NCD"],
      required: true,
    },

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      trim: true,
    },

    sessionName: {
      type: String,
      trim: true,
    },

    topic: {
      type: String,
      trim: true,
    },

    workshopName: {
      type: String,
      trim: true,
    },

    date: {
      type: String,
      trim: true,
    },

    time: {
      type: String,
      trim: true,
    },

    hall: {
      type: String,
      trim: true,
    },

    // PANELIST invitation details
    moderators: {
      type: [PanelPersonSchema],
      default: [],
    },

    coPanellists: {
      type: [PanelPersonSchema],
      default: [],
    },

    // Backward compatibility with existing records
    panelPeople: {
      type: [PanelPersonSchema],
      default: [],
    },

    // Faculty invitation response
    responseStatus: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "DECLINED"],
      default: "PENDING",
    },

    // Store only the SHA-256 hash of the response token
    responseTokenHash: {
      type: String,
      default: null,
      index: true,
    },

    responseTokenExpiresAt: {
      type: Date,
      default: null,
    },

    respondedAt: {
      type: Date,
      default: null,
    },

    isMailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.FacultyInvitation ||
  mongoose.model("FacultyInvitation", FacultyInvitationSchema);
