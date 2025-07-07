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
        const categoriesWithCounts = await db_1.db
            .select({
            id: db_1.categories.id,
            name: db_1.categories.name,
            nameVi: db_1.categories.nameVi,
            description: db_1.categories.description,
            descriptionVi: db_1.categories.descriptionVi,
            slug: db_1.categories.slug,
            isActive: db_1.categories.isActive,
            createdAt: db_1.categories.createdAt,
            updatedAt: db_1.categories.updatedAt,
            colorsCount: (0, drizzle_orm_1.count)(db_1.colors.id),
            productsCount: (0, drizzle_orm_1.count)(db_1.products.id),
            articlesCount: (0, drizzle_orm_1.count)(db_1.articles.id),
        })
            .from(db_1.categories)
            .leftJoin(db_1.colors, (0, drizzle_orm_1.eq)(db_1.categories.id, db_1.colors.categoryId))
            .leftJoin(db_1.products, (0, drizzle_orm_1.eq)(db_1.categories.id, db_1.products.categoryId))
            .leftJoin(db_1.articles, (0, drizzle_orm_1.eq)(db_1.categories.id, db_1.articles.categoryId))
            .groupBy(db_1.categories.id)
            .orderBy((0, drizzle_orm_1.desc)(db_1.categories.createdAt));
        res.json(categoriesWithCounts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch categories' });
        return;
    }
});
router.get('/:id', async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);
        const category = await db_1.db.select().from(db_1.categories)
            .where((0, drizzle_orm_1.eq)(db_1.categories.id, categoryId))
            .limit(1);
        if (!category.length) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }
        res.json(category[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch category' });
        return;
    }
});
router.post('/', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin', 'editor']), async (req, res) => {
    try {
        const { name, nameVi, description, descriptionVi, slug, isActive } = req.body;
        if (!name || !nameVi || !slug) {
            res.status(400).json({ error: 'Name, nameVi, and slug are required' });
            return;
        }
        const newCategory = await db_1.db.insert(db_1.categories).values({
            name,
            nameVi,
            description,
            descriptionVi,
            slug,
            isActive: isActive ?? true,
        }).returning();
        res.status(201).json(newCategory[0]);
    }
    catch (error) {
        console.error('Error creating category:', error);
        if (error.code === '23505') {
            res.status(400).json({ error: 'Category with this slug already exists' });
        }
        else {
            res.status(500).json({ error: 'Failed to create category' });
        }
    }
});
router.put('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin', 'editor']), async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);
        const { name, nameVi, description, descriptionVi, slug, isActive } = req.body;
        const updatedCategory = await db_1.db.update(db_1.categories)
            .set({
            name,
            nameVi,
            description,
            descriptionVi,
            slug,
            isActive,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(db_1.categories.id, categoryId))
            .returning();
        if (!updatedCategory.length) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }
        res.json(updatedCategory[0]);
    }
    catch (error) {
        console.error('Error updating category:', error);
        if (error.code === '23505') {
            res.status(400).json({ error: 'Category with this slug already exists' });
        }
        else {
            res.status(500).json({ error: 'Failed to update category' });
        }
    }
});
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);
        const colorsCount = await db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(db_1.colors)
            .where((0, drizzle_orm_1.eq)(db_1.colors.categoryId, categoryId));
        const productsCount = await db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(db_1.products)
            .where((0, drizzle_orm_1.eq)(db_1.products.categoryId, categoryId));
        const articlesCount = await db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(db_1.articles)
            .where((0, drizzle_orm_1.eq)(db_1.articles.categoryId, categoryId));
        const totalItems = colorsCount[0].count + productsCount[0].count + articlesCount[0].count;
        if (totalItems > 0) {
            res.status(400).json({
                error: 'Cannot delete category with associated items',
                details: {
                    colors: colorsCount[0].count,
                    products: productsCount[0].count,
                    articles: articlesCount[0].count,
                }
            });
            return;
        }
        const deletedCategory = await db_1.db.delete(db_1.categories)
            .where((0, drizzle_orm_1.eq)(db_1.categories.id, categoryId))
            .returning();
        if (!deletedCategory.length) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }
        res.json({ message: 'Category deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete category' });
        return;
    }
});
exports.default = router;
//# sourceMappingURL=categories.js.map