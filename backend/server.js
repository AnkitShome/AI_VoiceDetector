import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";

import initializePassport from './config/passport.js';
import connectDB from './config/mongo.js';

import authRoutes from './routes/user.js';
import studentRoutes from './routes/student.js';
import examinerRoutes from './routes/examiner.js';
import testRoutes from './routes/test.js';
import evaluatorRoutes from './routes/evaluator.js';
import detailsRoutes from './routes/details.js';

dotenv.config();
connectDB();
initializePassport(passport);

const app = express();

app.use(cors({
   origin: "http://localhost:3000",
   credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
   secret: process.env.SESSION_SECRET || 'defaultSecret',
   resave: false,
   saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
   res.status(200).send('🚀 Server is running!');
});

// Attach all routes here
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/professor', examinerRoutes);
app.use('/api/test', testRoutes);
app.use('/api/evaluator', evaluatorRoutes);
app.use('/api/details', detailsRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
