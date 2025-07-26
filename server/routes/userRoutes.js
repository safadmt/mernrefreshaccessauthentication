import express from 'express';
import authenticateToken from '../middleware/authenticate.js';
import { getUser } from '../controllers/userControllers.js';
const router = express.Router();

router.get('/', authenticateToken, getUser);

export default router;