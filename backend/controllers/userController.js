import User from "../models/User.js";
import OTP from "../models/OTP.js";
import otpGenerator from "otp-generator";
import Student from "../models/Student.js";
import Examiner from "../models/Examiner.js";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config(); // Ensure this is called to load JWT_SECRET

export const sendOtp = async (req, res) => {
  try {
    console.log(req.body);
    const { email } = req.body;
    console.log(email);
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      alphabets: false,
      digits: true,
    });

    while (await OTP.findOne({ otp })) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        alphabets: false,
        digits: true,
      });
    }

    await OTP.create({ otp, email, expiresAt: Date.now() + 5 * 60 * 1000 });
    return res.status(200).json({ msg: "OTP sent successfully", otp });
  } catch (error) {
    res.status(500).json({ msg: "Error sending OTP", error: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      role = "student",
      studentData,
      examinerData,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already registered" });

    const newUser = await User.create({
      name,
      username,
      email,
      password,
      role,
    });

    if (role === "student" && studentData) {
      await Student.create({
        user: newUser._id,
        scholarId: studentData.scholarId,
        department: studentData.department,
      });
    }

    if (role === "examiner" && examinerData) {
      await Examiner.create({
        user: newUser._id,
        department: examinerData.department,
      });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const { password: pw, ...userWithoutPassword } = newUser.toObject();

    return res.status(200).json({
      msg: "User registered",
      user: userWithoutPassword,
      token, // ✅ Send token to frontend
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error while registering user",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Authentication failed" });
    }

    req.login(req.user, async (err) => {
      if (err) return next(err);

      let profile = null;
      if (req.user.role === "student") {
        profile = await Student.findOne({ user: req.user._id });
      } else if (req.user.role === "professor") {
        profile = await Examiner.findOne({ user: req.user._id });
      }

      const { password, ...userWithoutPassword } = req.user.toObject();

      // ✅ Create JWT token
      const userInDb = await User.findById(req.user._id); // or whatever your user model is
      const token = jwt.sign(
        {
          id: userInDb._id,
          role: userInDb.role,
          email: userInDb.email, // ✅ now guaranteed
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.status(200).json({
        msg: "Login successful",
        token, // ✅ Send token to frontend
        user: userWithoutPassword,
        profile,
      });
    });
  } catch (error) {
    res.status(500).json({ msg: "Login error", error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    req.logout((err) => {
      if (err)
        return res
          .status(500)
          .json({ msg: "Logout error", error: err.message });
      res.status(200).json({ msg: "Logout successful" });
    });
  } catch (error) {
    res.status(500).json({ msg: "Logout error", error: error.message });
  }
};
