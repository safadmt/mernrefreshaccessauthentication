import express from 'express';
import  cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { configureDb } from './config/dbConfig.js';
import { appConfig } from './config/appConfig.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: appConfig.allowed_origin, credentials: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Connect DB & Start
const port = appConfig.port

app.listen(port,  () => {
    console.log(`Server running on port ${port}`);
    configureDb()
})