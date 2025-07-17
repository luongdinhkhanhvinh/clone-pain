import express from 'express';
import * as authController from '../controllers/authController';
import { protect } from '../utils/auth';

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.use(protect);

router.get('/me', authController.getMe);
router.get('/logout', authController.logout);
router.put('/updatedetails', authController.updateDetails);
router.put('/updatepassword', authController.updatePassword);

export default router;
