import express from 'express';
import * as categoryController from '../controllers/categoryController';
import { protect, authorize } from '../utils/auth';

const router = express.Router();

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);

// Protected routes (require authentication)
router.use(protect);

// Admin-only routes
router.use(authorize('admin'));

router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;
