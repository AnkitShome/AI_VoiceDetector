import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js';

export default function initializePassport(passport) {
   passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
   }, async (username, password, done) => {
      try {
         const user = await User.findOne({ username });
         if (!user) return done(null, false, { message: 'User not found' });

         const isValid = await user.comparePassword(password);
         if (!isValid) return done(null, false, { message: 'Incorrect password' });

         return done(null, user);
      } catch (err) {
         return done(err);
      }
   }));

   passport.serializeUser((user, done) => done(null, user.id));
   passport.deserializeUser(async (id, done) => {
      const user = await User.findById(id);
      done(null, user);
   });
}
