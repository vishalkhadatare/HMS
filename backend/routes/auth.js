import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authRouter = express.Router();

//register route
authRouter.post("/register", async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        const hashedPassword = await bcrypt.hash(password, 10);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        returnres.status(500).json({ message: "Internal server error" });
    }
});

//login route
authRouter.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
        });

        let isProfileCompleted = false;
        if (user.role === 'doctor') {
            const Doctor = (await import("../models/Doctor.js")).default;
            const doctorProfile = await Doctor.findOne({ userId: user._id });
            if (doctorProfile) {
                isProfileCompleted = doctorProfile.isProfileCompleted;
            }
        }

        return res.json({
            message: "Login successful",
            token,
            role: user.role,
            name: user.name,
            isProfileCompleted
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default authRouter;
