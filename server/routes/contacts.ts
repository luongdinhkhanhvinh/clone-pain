import express from 'express';
import * as contactsController from '../controllers/contactsController';
import { protect, authorize } from '../utils/auth';

const router = express.Router();

// Bảo vệ tất cả route, chỉ cho admin hoặc user đã đăng nhập
router.use(protect);

router.get('/', contactsController.getAllContacts);
router.get('/:id', contactsController.getContactById);
router.post('/', contactsController.createContact);
router.put('/:id', contactsController.updateContact);
router.delete('/:id', contactsController.deleteContact);

export default router; 