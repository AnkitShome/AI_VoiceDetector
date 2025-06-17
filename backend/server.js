import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import cors from 'cors';

import initializePassport from './config/passport.js'; // ✅ import the function only
import connectDB from './config/mongo.js';

import authRoutes from './routes/user.js';
import studentRoutes from './routes/student.js';
import examinerRoutes from './routes/examiner.js';

// ... all your imports and setup above

dotenv.config();
connectDB(); 
initializePassport(passport); 

const app = express();

// ✅ 1. Middleware FIRST
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
   secret: process.env.SESSION_SECRET || 'defaultSecret',
   resave: false,
   saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ 2. Routes NEXT
app.get('/', (req, res) => {
   res.status(200).send('🚀 Server is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/professor', examinerRoutes);

// ✅ 3. THEN start the server
app.listen(5000, () => console.log('Server running on port 5000'));
