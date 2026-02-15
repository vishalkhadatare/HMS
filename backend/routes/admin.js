import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import { protect } from "../middleware/auth.js";
import { allowRole } from "../middleware/role.js";
import Doctor from "../models/Doctor.js";

const adminRouter = express.Router();

/* Add Doctor */
adminRouter.post("/add-doctor", protect, allowRole("admin"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor"
    });

    // Create Doctor profile linked to User

    const newDoctorProfile = await Doctor.create({
      userId: doctor._id,
      specialization: "General Physician", 
      experience: 0,
      phone: "N/A",
      address: "N/A"
    });

    res.json({ message: "Doctor added successfully", doctor });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});


adminRouter.get("/appointments", protect, allowRole("admin"), async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("doctor", "name email");

    res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});


adminRouter.get("/stats", protect, allowRole("admin"), async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();

    res.json({ totalDoctors, totalAppointments });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

adminRouter.delete("/delete-doctor/:id", protect, allowRole("admin"), async (req, res) => {
  try {
    const doctorId = req.params.id; 

  
    const doctorProfile = await Doctor.findById(doctorId);
    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor not found" });
    }

   
    await User.findByIdAndDelete(doctorProfile.userId);

    await Doctor.findByIdAndDelete(doctorId);

    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default adminRouter;