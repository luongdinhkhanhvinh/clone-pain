import express from 'express';
import * as settingsController from '../controllers/settingsController';
import { protect, authorize } from '../utils/auth';

const router = express.Router();

// Protected routes (require authentication)
router.use(protect);

// Admin-only routes
router.use(authorize('admin'));

router.get('/', settingsController.getSettings);
router.get('/:key', settingsController.getSetting);
router.put('/', settingsController.updateSettings);
router.put('/:key', settingsController.updateSetting);
router.delete('/:key', settingsController.deleteSetting);

export default router;
