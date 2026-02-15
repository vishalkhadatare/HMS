import express from "express";
import { protect } from "../middleware/auth.js";
import { allowRole } from "../middleware/role.js";
import Doctor from "../models/Doctor.js";

const doctorRouter = express.Router();

doctorRouter.put(
  "/profile",
  protect,
  allowRole("doctor"),
  async (req, res) => {
    try {
      const updatedDoctor = await Doctor.findOneAndUpdate(
        { userId: req.user.userId },
        {
          ...req.body,
          isProfileCompleted: true,
          userId: req.user.userId // Ensure userId is set on creation
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      return res.status(200).json({
        message: "Profile updated successfully",
        doctor: updatedDoctor
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

doctorRouter.get(
  "/profile",
  protect,
  allowRole("doctor"),
  async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ userId: req.user.userId }).populate("userId", "name email");
      if (!doctor) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }
      res.json(doctor);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

doctorRouter.get("/list", protect, async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate("userId", "name email")
      .select("userId specialization experience phone address availableDays availableTimeSlots");

    const formattedDoctors = doctors.map(doctor => ({
      _id: doctor._id,
      name: doctor.userId?.name || "Unknown",
      email: doctor.userId?.email || "No email",
      specialization: doctor.specialization,
      experience: doctor.experience,
      phone: doctor.phone,
      address: doctor.address,
      availableDays: doctor.availableDays || [],
      availableTimeSlots: doctor.availableTimeSlots || [],
      userId: doctor.userId // Keep original userId for reference
    }));

    res.json(formattedDoctors);

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default doctorRouter;