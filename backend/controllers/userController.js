import User from "../models/User";
import OTP from "../models/OTP";

const sendOtp = async (req, res) => {
   try {
      const { email } = req.body

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

      await OTP.create({ otp, email, expiresAt: Date.now() + 5 * 60 * 1000, })
      return res.status(200).json({ msg: "OTP sent successfully", otp })

   } catch (error) {
      res.status(500).json({ msg: "Error sending OTP", error: error.message });
   }
}

const registerUser = async (req, res) => {
   try {
      const { name, username, email, otp, password } = req.body

      const existingUser = await User.findOne({ email })
      if (existingUser) { return res.status(400).json({ msg: 'User already registered' }) }

      const latestOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

      if (latestOtp.length === 0 || otp !== latestOtp) {
         return res.status(400).json({ msg: "Invalid or expired otp" })
      }

      const newUser = await User.create({ name, username, email, password });

      const user = newUser.select("password")

      return res.status(200).json({ msg: "User registered", user })

   } catch (error) {
      res.status(500).json({ msg: "Error while registering user", error: error.message });
   }
}

export const loginUser = async (req, res) => {
   try {
      if (!req.user) {
         return res.status(401).json({ msg: 'Authentication failed' });
      }
      res.status(200).json({ msg: 'Login successful', user: req.user });
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


export { sendOtp, registerUser }

