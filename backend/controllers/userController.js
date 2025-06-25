import User from "../models/User.js";
import Student from "../models/Student.js";
import Examiner from "../models/Examiner.js";
import OTP from "../models/OTP.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import otpGenerator from "otp-generator";
import { OAuth2Client } from "google-auth-library";

dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createTokens = (user) => {

   const accessToken = jwt.sign(
      { _id: user._id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "60m" }
   );

   const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
   );

   return { accessToken, refreshToken };
};

export const sendOtp = async (req, res) => {
   try {
      const { email } = req.body;

      let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, alphabets: false, digits: true });

      while (await OTP.findOne({ otp })) {
         otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, alphabets: false, digits: true });
      }

      await OTP.create({ otp, email, expiresAt: Date.now() + 5 * 60 * 1000 });

      res.status(200).json({ msg: "OTP sent successfully", otp });
   } catch (err) {
      res.status(500).json({ msg: "Error sending OTP", error: err.message });
   }
};

export const registerUser = async (req, res) => {
   try {
      const { name, username, email, password, role = "student", studentData, examinerData } = req.body;

      if (!["student", "examiner"].includes(role)) return res.status(400).json({ msg: "Invalid role specified" });

      if (await User.findOne({ email })) return res.status(400).json({ msg: "User already registered" });

      const newUser = await User.create({ name, username, email, password, role });

      if (role === "student" && studentData) {
         const parsed = typeof studentData === "string" ? JSON.parse(studentData) : studentData;

         await Student.create({ user: newUser._id, scholarId: parsed.scholarId, department: parsed.department });
      }

      if (role === "examiner" && examinerData) {
         const parsed = typeof examinerData === "string" ? JSON.parse(examinerData) : examinerData;

         await Examiner.create({ user: newUser._id, department: parsed.department });
      }

      const { password: _, ...userObj } = newUser.toObject();

      res.status(200).json({ msg: "User registered", user: userObj });
   } catch (err) {
      res.status(500).json({ msg: "Error while registering user", error: err.message });
   }
};

export const loginUser = async (req, res) => {
   try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user || !(await user.comparePassword(password)))
         return res.status(401).json({ msg: "Invalid credentials" });

      const { accessToken, refreshToken } = createTokens(user);

      res.cookie("accessToken", accessToken,
         {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 3600000
         });

      res.cookie("refreshToken", refreshToken,
         {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 3600000
         });

      const { password: __, ...userObj } = user.toObject();

      res.status(200).json({ msg: "Login successful", user: userObj });
   } catch (err) {
      res.status(500).json({ msg: "Login failed", error: err.message });
   }
};

export const googleLogin = async (req, res) => {
   const { credential, role = "student", studentData, examinerData } = req.body;

   try {
      const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });

      const { email, name } = ticket.getPayload();

      let user = await User.findOne({ email });

      if (!user) {
         user = await User.create({ name, email, username: email.split("@")[0], password: "google_oauth", role });
         if (role === "student" && studentData) {
            const parsed = typeof studentData === "string" ? JSON.parse(studentData) : studentData;
            await Student.create({ user: user._id, scholarId: parsed.scholarId, department: parsed.department });
         }
         if (role === "examiner" && examinerData) {
            const parsed = typeof examinerData === "string" ? JSON.parse(examinerData) : examinerData;
            await Examiner.create({ user: user._id, department: parsed.department });
         }
      }

      const { accessToken, refreshToken } = createTokens(user);
      res.cookie("accessToken", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict", maxAge: 3600000 });
      res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict", maxAge: 7 * 24 * 3600000 });
      const { password: __, ...userObj } = user.toObject();
      res.status(200).json({ msg: "Google login successful", user: userObj });
   } catch (err) {
      res.status(400).json({ msg: "Google login failed", error: err.message });
   }
};

export const refreshAccessToken = async (req, res) => {
   const token = req.cookies?.refreshToken;

   if (!token) return res.status(401).json({ msg: "No refresh token" });

   try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      const user = await User.findById(decoded.id);

      if (!user) return res.status(404).json({ msg: "User not found" });

      const accessToken = jwt.sign(
         { _id: user._id, username: user.username, email: user.email, role: user.role },
         process.env.JWT_ACCESS_SECRET, { expiresIn: "60m" }

      );

      res.cookie("accessToken", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict", maxAge: 3600000 });

      res.status(200).json({ msg: "Access token refreshed" });
   } catch (err) {
      res.status(403).json({ msg: "Invalid refresh token" });
   }
};

export const logoutUser = (req, res) => {

   res.clearCookie("accessToken", { httpOnly: true, sameSite: "Strict", secure: process.env.NODE_ENV === "production" });

   res.clearCookie("refreshToken", { httpOnly: true, sameSite: "Strict", secure: process.env.NODE_ENV === "production" });

   res.status(200).json({ msg: "Logged out" });
};
