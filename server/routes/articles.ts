import express from 'express';
import * as articlesController from '../controllers/articlesController';
import { protect, authorize } from '../utils/auth';

const router = express.Router();

// Bảo vệ tất cả route, chỉ cho admin hoặc user đã đăng nhập
router.use(protect);

router.get('/', articlesController.getAllArticles);
router.get('/:id', articlesController.getArticleById);
router.post('/', articlesController.createArticle);
router.put('/:id', articlesController.updateArticle);
router.delete('/:id', articlesController.deleteArticle);

export default router; 