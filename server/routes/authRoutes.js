import express from 'express';
import { loginUser, logoutUser, refreshAccessToken, registerUser } from '../controllers/authCotrollers.js';
const router = express.Router();

router.post('/login' , loginUser);

router.post('/register', registerUser)

router.post('/logout', logoutUser);

router.get('/refresh', refreshAccessToken)

export default router;