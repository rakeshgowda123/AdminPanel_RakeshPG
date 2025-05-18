import express from 'express';
import { loginUser, getMe, seedAdmin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/seed-admin', seedAdmin); // For initial setup only

export default router;