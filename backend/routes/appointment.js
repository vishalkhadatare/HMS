import express from "express";
import Appointment from "../models/Appointment.js";
import { protect } from "../middleware/auth.js";
import { allowRole } from "../middleware/role.js";

const appointmentRouter = express.Router();

/* Patient books appointment */
appointmentRouter.post(
  "/book",
  protect,
  allowRole("patient"),
  async (req, res) => {
    try {
      const { doctorId, date, time } = req.body;

      // Check if slot already booked
      const existingAppointment = await Appointment.findOne({
        doctor: doctorId,
        date,
        time,
        status: { $in: ["Pending", "Accepted"] }
      });

      if (existingAppointment) {
        return res.status(409).json({
          message: "This time slot is already booked. Please choose another slot."
        });
      }

      const appointment = await Appointment.create({
        patient: req.user.userId,
        doctor: doctorId,
        date,
        time
      });

      return res.status(201).json({
        message: "Appointment booked successfully",
        appointment
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

appointmentRouter.get(
  "/patient/view",
  protect,
  allowRole("patient"),
  async (req, res) => {
    try {
      const listAppointment = await Appointment.find({
        patient: req.user.userId
      }).populate("doctor", "name email");

      if (listAppointment.length === 0) {
        return res.status(200).json({
          message: "No appointments found",
          listAppointment: []
        });
      }

      return res.status(200).json({
        message: "All Appointments",
        listAppointment
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

appointmentRouter.patch(
  "/cancel/:id",
  protect,
  allowRole("patient"),
  async (req, res) => {
    try {
      const appointment = await Appointment.findOne({
        _id: req.params.id,
        patient: req.user.userId
      });

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      if (appointment.status === "Completed") {
        return res
          .status(400)
          .json({ message: "Completed appointment cannot be cancelled" });
      }

      appointment.status = "Cancelled";
      await appointment.save();

      return res.json({
        message: "Appointment cancelled successfully",
        appointment
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

/* Doctor updates status */
appointmentRouter.patch(
  "/updateStatus/:id",
  protect,
  allowRole("doctor"),
  async (req, res) => {
    try {
      const { status } = req.body;

      const appointment = await Appointment.findOneAndUpdate(
        { _id: req.params.id, doctor: req.user.userId },
        { status },
        { new: true }
      );

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      res.json(appointment);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

appointmentRouter.get(
  "/doctor/view",
  protect,
  allowRole("doctor"),
  async (req, res) => {
    try {
      const appointments = await Appointment.find({
        doctor: req.user.userId
      })
        .populate("patient", "name email")
        .sort({ date: 1, time: 1 });

      if (appointments.length === 0) {
        return res.status(200).json({
          message: "No scheduled appointments",
          appointments: []
        });
      }

      return res.status(200).json({
        message: "Scheduled Appointments",
        appointments
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default appointmentRouter;