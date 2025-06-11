
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