import dotenv from "dotenv";
dotenv.config();
import express from "express";
import helmet from 'helmet'
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

// Routes
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import webinarRoutes from "./routes/webinarRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import conferenceRoutes from "./routes/conferenceRoutes.js";
import speakerRoutes from "./routes/speakerRoutes.js";
import assignSpeakerRoutes from "./routes/assignSpeakerRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import webinarRegistrationRoutes from "./routes/webinarRegistrationRoutes.js";
import webinarAttendanceRoutes from "./routes/webinarAttendanceRoutes.js";
import webinarEmailRoutes from "./routes/webinarEmailRoutes.js";
import webinarSettingRoutes from "./routes/webinarSettingRoutes.js";
import courseRegistrationRoutes from "./routes/courseRegistrationRoutes.js";
import conferenceRegistrationRoutes from "./routes/conferenceRegistrationRoutes.js";
import hallRoutes from "./routes/hallRoutes.js";
import trackRoutes from "./routes/trackRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import topicRoutes from "./routes/topicRoutes.js";
import topicCommentRoutes from "./routes/topicCommentRoutes.js";
import weekCategoryRoutes from "./routes/weekCategoryRoutes.js";
import courseModuleRoutes from "./routes/courseModuleRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import askedQuestionRoutes from "./routes/askedQuestionRoutes.js";
import moduleCommentRoutes from "./routes/moduleCommentRoutes.js";
import askedQAndARoutes from "./routes/askedQAndARoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import sendFeedbackRoutes from "./routes/sendFeedbackRoutes.js";
import submitPublicFeedbackRoutes from "./routes/submitPublicFeedbackRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import submitQuizRoutes from "./routes/submitQuizRoutes.js";
import speakerAnalyticsRoutes from "./routes/speakerAnalyticsRoutes.js";

const app = express();

// =======================
// CORS setup for multiple frontends
// =======================
const allowedOrigins = [
  "https://localhost:3000",
  "https://localhost:3001",
  process.env.ADMIN_FRONTEND_URL,
  process.env.USER_FRONTEND_URL,
];


// const corsOptions = {                                                                 
//   origin: (origin, callback) => {
//     // allow any origin (including browser requests)
//     callback(null, true);
//   },
//   credentials: true,
// };

const corsOptions = {
  origin: function (origin, callback) {
    // Allow server-to-server & Postman
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    console.error("CORS blocked origin:", origin)
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true, // 🔥 REQUIRED for cookies
}

app.use(helmet())
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); // Needed to read cookies (refresh token)
app.use(morgan("dev"));

// =======================
// Health check
// =======================
app.get("/", (req, res) => {
  res.send("USI Backend is running ..... ");
});

// =======================
// API Routes
// =======================
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

app.use("/api", webinarRoutes);
app.use("/api", courseRoutes);
app.use("/api", conferenceRoutes);
app.use("/api", speakerRoutes);
app.use("/api", assignSpeakerRoutes);
app.use("/api", meetingRoutes);
app.use("/api", webinarRegistrationRoutes);
app.use("/api", webinarAttendanceRoutes);
app.use("/api", webinarEmailRoutes);
app.use("/api", webinarSettingRoutes);
app.use("/api", courseRegistrationRoutes);
app.use("/api", conferenceRegistrationRoutes);
app.use("/api", hallRoutes);
app.use("/api", trackRoutes);
app.use("/api", sessionRoutes);
app.use("/api", topicRoutes);
app.use("/api", topicCommentRoutes);
app.use("/api", weekCategoryRoutes);
app.use("/api", courseModuleRoutes);
app.use("/api", commentRoutes);
app.use("/api", askedQuestionRoutes);
app.use("/api", moduleCommentRoutes);
app.use("/api", askedQAndARoutes);
app.use("/api", feedbackRoutes);
app.use("/api", sendFeedbackRoutes);
app.use("/api", submitPublicFeedbackRoutes);
app.use("/api", quizRoutes);
app.use("/api", submitQuizRoutes);
app.use("/api", speakerAnalyticsRoutes);


// =======================
// Start Server SAFELY
// =======================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();