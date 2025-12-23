import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

// Routes
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import webinarRoutes from "./routes/webinarRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import speakerRoutes from "./routes/speakerRoutes.js";
import assignSpeakerRoutes from "./routes/assignSpeakerRoutes.js";
import webinarRegistrationRoutes from "./routes/webinarRegistrationRoutes.js";
import courseRegistrationRoutes from "./routes/courseRegistrationRoutes.js";
import weekCategoryRoutes from "./routes/weekCategoryRoutes.js";
import courseModuleRoutes from "./routes/courseModuleRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

await connectDB();

const app = express();

// =======================
// CORS setup for multiple frontends
// =======================
const allowedOrigins = [
  "http://localhost:3000",
  process.env.ADMIN_FRONTEND_URL,
  process.env.USER_FRONTEND_URL,
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow any origin (including browser requests)
    callback(null, true);
  },
  credentials: true,
};


app.use(express.json());
app.use(cors(corsOptions));
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
app.use("/api", speakerRoutes);
app.use("/api", assignSpeakerRoutes);
app.use("/api", webinarRegistrationRoutes);
app.use("/api", courseRegistrationRoutes);
app.use("/api", weekCategoryRoutes);
app.use("/api", courseModuleRoutes);
app.use("/api", commentRoutes);


// =======================
// Start server
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
