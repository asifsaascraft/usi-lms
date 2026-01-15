import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema(
  {
    conferenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conference",
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    topicType: {
      type: String,
      enum: ["Presentation", "Panel Discussion", "Quiz", "Debate"],
      required: [true, "Topic Type is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    startTime: {
      type: String, // Format: hh:mm A (e.g., 09:00 AM)
      required: [true, "Start Time is required"],
    },
    endTime: {
      type: String, // Format: hh:mm A (e.g., 05:00 PM)
      required: [true, "End Time is required"],
    },
    videoLink: {
      type: String,
      required: [true, "Video Link is required"],
    },
    description: {
      type: String,
    },
    //Optional Part (Only required according to topic type)
    speakerId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Speaker",
    }],
    moderator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Speaker",
    },
    panelist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Speaker",
    }],
    quizMaster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Speaker",
    },
    teamMember: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Speaker",
    }],
  },
  { timestamps: true }
);

export default mongoose.models.Topic || mongoose.model("Topic", TopicSchema);
