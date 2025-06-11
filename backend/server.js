import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';

import './config/passport.js';
import connectDB from './config/mongo.js';
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/student.js';
import professorRoutes from './routes/professor.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(passport.initialize());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/professor', professorRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));