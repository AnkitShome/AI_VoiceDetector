import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
   const token = req.cookies?.accessToken;

   if (!token) return res.status(401).json({ msg: "Access token missing" });

   try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.user = decoded; // Attach user info to req
      next();
   } catch (err) {
      return res.status(403).json({ msg: "Invalid or expired access token" });
   }
};

const authorizeRoles = (...allowedRoles) => {
   return (req, res, next) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
         return res.status(403).json({ msg: "You are not authorized" });
      }
      next();
   };
};


export {
   verifyToken,
   authorizeRoles
}
