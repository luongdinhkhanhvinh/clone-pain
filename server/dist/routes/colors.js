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
        const isActive = req.query.isActive;
        const offset = (page - 1) * limit;
        let whereConditions = [];
        if (search) {
            whereConditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(db_1.colors.name, `%${search}%`), (0, drizzle_orm_1.like)(db_1.colors.nameVi, `%${search}%`), (0, drizzle_orm_1.like)(db_1.colors.code, `%${search}%`)));
        }
        if (categoryId) {
            whereConditions.push((0, drizzle_orm_1.eq)(db_1.colors.categoryId, categoryId));
        }
        if (isActive !== undefined) {
            whereConditions.push((0, drizzle_orm_1.eq)(db_1.colors.isActive, isActive === 'true'));
        }
        const whereClause = whereConditions.length > 0 ? (0, drizzle_orm_1.and)(...whereConditions) : undefined;
        const colorsWithCategory = await db_1.db
            .select({
            id: db_1.colors.id,
            name: db_1.colors.name,
            nameVi: db_1.colors.nameVi,
            code: db_1.colors.code,
            hexColor: db_1.colors.hexColor,
            description: db_1.colors.description,
            descriptionVi: db_1.colors.descriptionVi,
            marketingCopy: db_1.colors.marketingCopy,
            marketingCopyVi: db_1.colors.marketingCopyVi,
            technicalInfo: db_1.colors.technicalInfo,
            applications: db_1.colors.applications,
            combinations: db_1.colors.combinations,
            imageUrl: db_1.colors.imageUrl,
            popularity: db_1.colors.popularity,
            isActive: db_1.colors.isActive,
            createdAt: db_1.colors.createdAt,
            updatedAt: db_1.colors.updatedAt,
            category: {
                id: db_1.categories.id,
                name: db_1.categories.name,
                nameVi: db_1.categories.nameVi,
            },
        })
            .from(db_1.colors)
            .leftJoin(db_1.categories, (0, drizzle_orm_1.eq)(db_1.colors.categoryId, db_1.categories.id))
            .where(whereClause)
            .orderBy((0, drizzle_orm_1.desc)(db_1.colors.popularity), (0, drizzle_orm_1.desc)(db_1.colors.createdAt))
            .limit(limit)
            .offset(offset);
        const totalResult = await db_1.db
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(db_1.colors)
            .where(whereClause);
        const total = totalResult[0].count;
        const totalPages = Math.ceil(total / limit);
        res.json({
            data: colorsWithCategory,
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
        res.status(500).json({ error: 'Failed to fetch colors' });
        return;
    }
});
router.get('/:id', async (req, res) => {
    try {
        const colorId = parseInt(req.params.id);
        const colorWithCategory = await db_1.db
            .select({
            id: db_1.colors.id,
            name: db_1.colors.name,
            nameVi: db_1.colors.nameVi,
            code: db_1.colors.code,
            hexColor: db_1.colors.hexColor,
            description: db_1.colors.description,
            descriptionVi: db_1.colors.descriptionVi,
            marketingCopy: db_1.colors.marketingCopy,
            marketingCopyVi: db_1.colors.marketingCopyVi,
            technicalInfo: db_1.colors.technicalInfo,
            applications: db_1.colors.applications,
            combinations: db_1.colors.combinations,
            imageUrl: db_1.colors.imageUrl,
            popularity: db_1.colors.popularity,
            isActive: db_1.colors.isActive,
            createdAt: db_1.colors.createdAt,
            updatedAt: db_1.colors.updatedAt,
            category: {
                id: db_1.categories.id,
                name: db_1.categories.name,
                nameVi: db_1.categories.nameVi,
            },
        })
            .from(db_1.colors)
            .leftJoin(db_1.categories, (0, drizzle_orm_1.eq)(db_1.colors.categoryId, db_1.categories.id))
            .where((0, drizzle_orm_1.eq)(db_1.colors.id, colorId))
            .limit(1);
        if (!colorWithCategory.length) {
            res.status(404).json({ error: 'Color not found' });
            return;
        }
        res.json(colorWithCategory[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch color' });
        return;
    }
});
router.post('/', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin', 'editor']), async (req, res) => {
    try {
        const { name, nameVi, code, hexColor, categoryId, description, descriptionVi, marketingCopy, marketingCopyVi, technicalInfo, applications, combinations, imageUrl, popularity, isActive, } = req.body;
        if (!name || !nameVi || !code || !hexColor) {
            res.status(400).json({ error: 'Name, nameVi, code, and hexColor are required' });
            return;
        }
        const newColor = await db_1.db.insert(db_1.colors).values({
            name,
            nameVi,
            code,
            hexColor,
            categoryId,
            description,
            descriptionVi,
            marketingCopy,
            marketingCopyVi,
            technicalInfo,
            applications,
            combinations,
            imageUrl,
            popularity: popularity || 0,
            isActive: isActive ?? true,
        }).returning();
        res.status(201).json(newColor[0]);
    }
    catch (error) {
        console.error('Error creating color:', error);
        if (error.code === '23505') {
            res.status(400).json({ error: 'Color with this code already exists' });
        }
        else {
            res.status(500).json({ error: 'Failed to create color' });
        }
    }
});
router.put('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin', 'editor']), async (req, res) => {
    try {
        const colorId = parseInt(req.params.id);
        const updateData = { ...req.body, updatedAt: new Date() };
        const updatedColor = await db_1.db.update(db_1.colors)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(db_1.colors.id, colorId))
            .returning();
        if (!updatedColor.length) {
            res.status(404).json({ error: 'Color not found' });
            return;
        }
        res.json(updatedColor[0]);
    }
    catch (error) {
        console.error('Error updating color:', error);
        if (error.code === '23505') {
            res.status(400).json({ error: 'Color with this code already exists' });
        }
        else {
            res.status(500).json({ error: 'Failed to update color' });
        }
    }
});
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        const colorId = parseInt(req.params.id);
        const productsCount = await db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(db_1.products)
            .where((0, drizzle_orm_1.eq)(db_1.products.colorId, colorId));
        if (productsCount[0].count > 0) {
            res.status(400).json({
                error: 'Cannot delete color with associated products',
                productsCount: productsCount[0].count,
            });
            return;
        }
        const deletedColor = await db_1.db.delete(db_1.colors)
            .where((0, drizzle_orm_1.eq)(db_1.colors.id, colorId))
            .returning();
        if (!deletedColor.length) {
            res.status(404).json({ error: 'Color not found' });
            return;
        }
        res.json({ message: 'Color deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete color' });
        return;
    }
});
exports.default = router;
//# sourceMappingURL=colors.js.map