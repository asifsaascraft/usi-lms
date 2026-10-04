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
  },
  { _id: false },
);

const FacultyInvitationSchema = new mongoose.Schema(
  {
    invitationType: {
      type: String,
      enum: ["WORKSHOP", "SOLO_TALK", "PANELIST", "MODERATOR"],
      required: true,
    },

    group: {
      type: String,
      enum: ["MP", "OUT_OF_MP"],
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

    venue: {
      type: String,
      trim: true,
    },

    // For PANELIST:
    // person[0] = Moderator
    // person[1..] = Co-Panellists
    //
    // For MODERATOR:
    // person[0..] = Panellists
    panelPeople: {
      type: [PanelPersonSchema],
      default: [],
    },

    // ---------------------------------------------------------
    // FACULTY INVITATION RESPONSE
    // ---------------------------------------------------------

    responseStatus: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "DECLINED"],
      default: "PENDING",
    },

    // Store only the SHA-256 hash of the response token.
    // The actual token is sent only inside the email link.
    responseTokenHash: {
      type: String,
      default: null,
      index: true,
    },

    // Response link expiry
    responseTokenExpiresAt: {
      type: Date,
      default: null,
    },

    // When faculty accepted/declined
    respondedAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  },
);

export default mongoose.models.FacultyInvitation ||
  mongoose.model("FacultyInvitation", FacultyInvitationSchema);