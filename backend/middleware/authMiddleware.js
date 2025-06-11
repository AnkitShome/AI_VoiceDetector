
import passport from 'passport';

export const authenticateLogin = (req, res, next) => {
   passport.authenticate('local', (err, user, info) => {
      if (err) return res.status(500).json({ msg: 'Authentication error', error: err.message });
      if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

      req.logIn(user, err => {
         if (err) return res.status(500).json({ msg: 'Login error', error: err.message });
         req.user = user;
         next();
      });
   })(req, res, next);
};


export const ensureAuthenticated = (req, res, next) => {
   if (req.isAuthenticated()) return next();
   return res.status(401).json({ msg: 'You must be logged in to access this resource' })
}

export const authorizeRoles = (...roles) => {
   return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
         return res.status(403).json({ msg: 'Acess denied: insufficient role' })
      }
      mext();
   }
}

