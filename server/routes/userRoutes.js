import express from 'express';
import authenticateToken from '../middleware/authenticate.js';
import { getUser , getUsers} from '../controllers/userControllers.js';
const router = express.Router();

router.get('/', authenticateToken, getUser);

router.get('/getAll', authenticateToken, getUsers);
export default router;