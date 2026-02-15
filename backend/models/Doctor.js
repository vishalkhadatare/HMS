import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    availableDays: {
      type: [String], // ["Monday", "Tuesday"]
      default: []
    },
    availableTimeSlots: {
      type: [String], // ["10:00 AM", "10:30 AM"]
      default: []
    },
    isProfileCompleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);