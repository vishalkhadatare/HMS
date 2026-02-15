import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import appointmentRouter from "./routes/appointment.js";
import adminRouter from "./routes/admin.js";
import doctorRouter from "./routes/doctor.js";
import connectDB from "./connect/connectdb.js";

dotenv.config();

// Connect to Database
connectDB();

const app = express();

app.use(cookieParser());
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Update with your frontend URL
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

