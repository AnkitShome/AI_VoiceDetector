import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';

import initializePassport from './config/passport.js'; // ✅ import the function only
import connectDB from './config/mongo.js';

import authRoutes from './routes/user.js';
import studentRoutes from './routes/student.js';
import examinerRoutes from './routes/examiner.js';

dotenv.config();
connectDB(); // ✅ Connect to MongoDB
initializePassport(passport); // ✅ Register local strategy before using passport

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
   secret: process.env.SESSION_SECRET || 'defaultSecret',
   resave: false,
   saveUninitialized: false,
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
   res.status(200).send('🚀 Server is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/professor', examinerRoutes);

// Start server
app.listen(5000, () => console.log('Server running on port 5000'));
