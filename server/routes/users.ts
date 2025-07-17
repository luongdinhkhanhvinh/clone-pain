import express from 'express';
import * as usersController from '../controllers/usersController';
import { protect, authorize } from '../utils/auth';

const router = express.Router();

// Bảo vệ tất cả route, chỉ cho admin hoặc user đã đăng nhập
router.use(protect);

router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

export default router; 