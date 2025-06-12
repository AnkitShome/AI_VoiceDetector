
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import otpGenerator from 'otp-generator';
import Student from '../models/Student.js';
import Examiner from '../models/Examiner.js';

export const sendOtp = async (req, res) => {
   try {
      console.log(req.body)
      const { email } = req.body;
      console.log(email)
      let otp = otpGenerator.generate(6, {
         upperCaseAlphabets: false,
         specialChars: false,
         alphabets: false,
         digits: true
      });

      while (await OTP.findOne({ otp })) {
         otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            alphabets: false,
            digits: true
         });
      }

      await OTP.create({ otp, email, expiresAt: Date.now() + 5 * 60 * 1000 });
      return res.status(200).json({ msg: 'OTP sent successfully', otp });
   } catch (error) {
      res.status(500).json({ msg: 'Error sending OTP', error: error.message });
   }
};

export const registerUser = async (req, res) => {
   try {
      const { name, username, email, otp, password, role = 'student', studentData, examinerData } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ msg: 'User already registered' });

      const latestOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

      if (
         latestOtp.length === 0 ||
         latestOtp[0].otp !== otp ||
         latestOtp[0].expiresAt < Date.now()
      ) {
         return res.status(400).json({ msg: 'Invalid or expired OTP' });
      }

      const newUser = await User.create({ name, username, email, password, role });

      if (role == 'student' && studentData) {
         await Student.create({
            user: newUser._id,
            scholarId: studentData.scholarId,
            department: studentData.department
         })
      }

      if (role == 'examiner' && examinerData) {
         await Examiner.create({
            user: newUser._id,
            department: examinerData.department,
         })
      }

      const { password: pw, ...userWithoutPassword } = newUser.toObject();

      return res.status(200).json({ msg: 'User registered', user: userWithoutPassword });
   } catch (error) {
      res.status(500).json({ msg: 'Error while registering user', error: error.message });
   }
};

export const loginUser = async (req, res) => {
   try {
      if (!req.user) {
         return res.status(401).json({ msg: 'Authentication failed' });
      }

      let profile = null;
      if (req.user.role === 'student') {
         profile = await Student.findOne({ user: req.user._id });
      } else if (req.user.role === 'professor') {
         profile = await Examiner.findOne({ user: req.user._id });
      }

      const { password, ...userWithoutPassword } = req.user.toObject();
      res.status(200).json({ msg: 'Login successful', user: userWithoutPassword, profile });

   } catch (error) {
      res.status(500).json({ msg: 'Login error', error: error.message });
   }
};

export const logoutUser = async (req, res) => {
   try {
      req.logout(err => {
         if (err) return res.status(500).json({ msg: 'Logout error', error: err.message });
         res.status(200).json({ msg: 'Logout successful' });
      });
   } catch (error) {
      res.status(500).json({ msg: 'Logout error', error: error.message });
   }
};
