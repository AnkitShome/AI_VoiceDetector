import passport from "passport";
import jwt from "jsonwebtoken";
import User from '../models/User.js';

export const authenticateLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err)
      return res
        .status(500)
        .json({ msg: "Authentication error", error: err.message });
    if (!user) return res.status(401).json({ msg: "Invalid credentials" });

    req.logIn(user, (err) => {
      if (err)
        return res.status(500).json({ msg: "Login error", error: err.message });
      req.user = user;
      next();
    });
  })(req, res, next);
};

export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res
    .status(401)
    .json({ msg: "You must be logged in to access this resource" });
};

export const ensureAuthenticated_jw = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 👈 Yahan pe user set ho raha hai
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Get just the token
  if (!token) return res.status(401).json({ msg: "No token, access denied" });
//   console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
   // console.log(err);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Acess denied: insufficient role" });
    }
    next();
  };
};
