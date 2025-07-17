import express from 'express';
import * as orderController from '../controllers/orderController';
import { protect, authorize } from '../utils/auth';

const router = express.Router();

// Protected routes (require authentication)
router.use(protect);

// User routes
router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrder);

// Admin routes
router.use(authorize('admin'));

router.get('/', orderController.getOrders);
router.put('/:id/status', orderController.updateOrderStatus);
router.put('/:id/payment-status', orderController.updatePaymentStatus);

export default router;
