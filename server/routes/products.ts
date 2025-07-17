import express from 'express';
import * as productController from '../controllers/productController';
import { protect, authorize } from '../utils/auth';

const router = express.Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Protected routes (require authentication)
router.use(protect);

// Admin-only routes
router.use(authorize('admin'));

router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
