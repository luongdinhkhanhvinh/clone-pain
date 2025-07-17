import express from 'express';
import * as pageController from '../controllers/pageController';
import { protect, authorize } from '../utils/auth';

const router = express.Router();

// Public routes
router.get('/', pageController.getPages);
router.get('/:idOrSlug', pageController.getPage);

// Protected routes (require authentication)
router.use(protect);

// Admin-only routes
router.use(authorize('admin'));

router.post('/', pageController.createPage);
router.put('/:id', pageController.updatePage);
router.delete('/:id', pageController.deletePage);

export default router;
