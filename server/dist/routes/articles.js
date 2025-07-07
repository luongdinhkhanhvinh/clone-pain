"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search;
        const categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : null;
        const isPublished = req.query.isPublished;
        const offset = (page - 1) * limit;
        let whereConditions = [];
        if (search) {
            whereConditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(db_1.articles.title, `%${search}%`), (0, drizzle_orm_1.like)(db_1.articles.titleVi, `%${search}%`), (0, drizzle_orm_1.like)(db_1.articles.slug, `%${search}%`)));
        }
        if (categoryId) {
            whereConditions.push((0, drizzle_orm_1.eq)(db_1.articles.categoryId, categoryId));
        }
        if (isPublished !== undefined) {
            whereConditions.push((0, drizzle_orm_1.eq)(db_1.articles.isPublished, isPublished === 'true'));
        }
        const whereClause = whereConditions.length > 0 ? (0, drizzle_orm_1.and)(...whereConditions) : undefined;
        const articlesWithCategory = await db_1.db
            .select({
            id: db_1.articles.id,
            title: db_1.articles.title,
            titleVi: db_1.articles.titleVi,
            slug: db_1.articles.slug,
            excerpt: db_1.articles.excerpt,
            excerptVi: db_1.articles.excerptVi,
            content: db_1.articles.content,
            contentVi: db_1.articles.contentVi,
            featuredImage: db_1.articles.featuredImage,
            tags: db_1.articles.tags,
            metaTitle: db_1.articles.metaTitle,
            metaDescription: db_1.articles.metaDescription,
            isPublished: db_1.articles.isPublished,
            publishedAt: db_1.articles.publishedAt,
            createdAt: db_1.articles.createdAt,
            updatedAt: db_1.articles.updatedAt,
            category: {
                id: db_1.categories.id,
                name: db_1.categories.name,
                nameVi: db_1.categories.nameVi,
            },
        })
            .from(db_1.articles)
            .leftJoin(db_1.categories, (0, drizzle_orm_1.eq)(db_1.articles.categoryId, db_1.categories.id))
            .where(whereClause)
            .orderBy((0, drizzle_orm_1.desc)(db_1.articles.createdAt))
            .limit(limit)
            .offset(offset);
        const totalResult = await db_1.db
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(db_1.articles)
            .where(whereClause);
        const total = totalResult[0].count;
        const totalPages = Math.ceil(total / limit);
        res.json({
            data: articlesWithCategory,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch articles' });
        return;
    }
});
router.get('/:id', async (req, res) => {
    try {
        const articleId = parseInt(req.params.id);
        const articleWithCategory = await db_1.db
            .select({
            id: db_1.articles.id,
            title: db_1.articles.title,
            titleVi: db_1.articles.titleVi,
            slug: db_1.articles.slug,
            excerpt: db_1.articles.excerpt,
            excerptVi: db_1.articles.excerptVi,
            content: db_1.articles.content,
            contentVi: db_1.articles.contentVi,
            featuredImage: db_1.articles.featuredImage,
            tags: db_1.articles.tags,
            metaTitle: db_1.articles.metaTitle,
            metaDescription: db_1.articles.metaDescription,
            isPublished: db_1.articles.isPublished,
            publishedAt: db_1.articles.publishedAt,
            createdAt: db_1.articles.createdAt,
            updatedAt: db_1.articles.updatedAt,
            category: {
                id: db_1.categories.id,
                name: db_1.categories.name,
                nameVi: db_1.categories.nameVi,
            },
        })
            .from(db_1.articles)
            .leftJoin(db_1.categories, (0, drizzle_orm_1.eq)(db_1.articles.categoryId, db_1.categories.id))
            .where((0, drizzle_orm_1.eq)(db_1.articles.id, articleId))
            .limit(1);
        if (!articleWithCategory.length) {
            res.status(404).json({ error: 'Article not found' });
            return;
        }
        res.json(articleWithCategory[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch article' });
        return;
    }
});
router.post('/', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin', 'editor']), async (req, res) => {
    try {
        const { title, titleVi, slug, excerpt, excerptVi, content, contentVi, featuredImage, categoryId, tags, metaTitle, metaDescription, isPublished, } = req.body;
        if (!title || !titleVi || !slug || !content || !contentVi) {
            res.status(400).json({ error: 'Title, titleVi, slug, content, and contentVi are required' });
            return;
        }
        const newArticle = await db_1.db.insert(db_1.articles).values({
            title,
            titleVi,
            slug,
            excerpt,
            excerptVi,
            content,
            contentVi,
            featuredImage,
            categoryId,
            tags,
            metaTitle,
            metaDescription,
            isPublished: isPublished ?? false,
            publishedAt: isPublished ? new Date() : null,
        }).returning();
        res.status(201).json(newArticle[0]);
    }
    catch (error) {
        console.error('Error creating article:', error);
        if (error.code === '23505') {
            res.status(400).json({ error: 'Article with this slug already exists' });
        }
        else {
            res.status(500).json({ error: 'Failed to create article' });
        }
    }
});
router.put('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin', 'editor']), async (req, res) => {
    try {
        const articleId = parseInt(req.params.id);
        const updateData = { ...req.body, updatedAt: new Date() };
        if (updateData.isPublished && !updateData.publishedAt) {
            updateData.publishedAt = new Date();
        }
        const updatedArticle = await db_1.db.update(db_1.articles)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(db_1.articles.id, articleId))
            .returning();
        if (!updatedArticle.length) {
            res.status(404).json({ error: 'Article not found' });
            return;
        }
        res.json(updatedArticle[0]);
    }
    catch (error) {
        console.error('Error updating article:', error);
        if (error.code === '23505') {
            res.status(400).json({ error: 'Article with this slug already exists' });
        }
        else {
            res.status(500).json({ error: 'Failed to update article' });
        }
    }
});
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        const articleId = parseInt(req.params.id);
        const deletedArticle = await db_1.db.delete(db_1.articles)
            .where((0, drizzle_orm_1.eq)(db_1.articles.id, articleId))
            .returning();
        if (!deletedArticle.length) {
            res.status(404).json({ error: 'Article not found' });
            return;
        }
        res.json({ message: 'Article deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete article' });
        return;
    }
});
exports.default = router;
//# sourceMappingURL=articles.js.map