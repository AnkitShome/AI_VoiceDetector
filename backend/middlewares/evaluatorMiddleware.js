import jwt from "jsonwebtoken";

export function requireEvaluatorAuth(req, res, next) {
   const token = req.cookies.evaluator_token;
   if (!token) return res.status(401).json({ error: "Not authenticated" });

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== "evaluator") throw new Error();
      req.evaluator = decoded;
      next();
   } catch (err) {
      res.status(401).json({ error: "Invalid or expired token" });
   }
<<<<<<< HEAD
}
=======
}
>>>>>>> 587950ddd6b1d81183998ee5a3b3c3c01bfc1aa5
