import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",          // local dev
    "https://ai-virtual-interviewer.vercel.app" // ✅ your Vercel deployed frontend
  ],
  credentials: true
}));
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });


// ✅ Register
app.post("/api/auth/register", async (req, res) => {
  console.log("REQ BODY:", req.body); // 👈 add this
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({
      message: "User registered successfully ✅",
      user: { email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});


// ✅ Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful ✅",
      token,
      user: { email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// ✅ Interview Questions (dummy)
app.get("/api/questions", (req, res) => {
  const questions = [
    "Tell me about yourself.",
    "Why should we hire you?",
    "What are your strengths and weaknesses?"
  ];
  res.status(200).json({ questions });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
