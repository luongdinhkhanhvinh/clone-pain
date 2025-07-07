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
        const colorId = req.query.colorId ? parseInt(req.query.colorId) : null;
        const isActive = req.query.isActive;
        const offset = (page - 1) * limit;
        let whereConditions = [];
        if (search) {
            whereConditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(db_1.products.name, `%${search}%`), (0, drizzle_orm_1.like)(db_1.products.nameVi, `%${search}%`), (0, drizzle_orm_1.like)(db_1.products.sku, `%${search}%`)));
        }
        if (categoryId) {
            whereConditions.push((0, drizzle_orm_1.eq)(db_1.products.categoryId, categoryId));
        }
        if (colorId) {
            whereConditions.push((0, drizzle_orm_1.eq)(db_1.products.colorId, colorId));
        }
        if (isActive !== undefined) {
            whereConditions.push((0, drizzle_orm_1.eq)(db_1.products.isActive, isActive === 'true'));
        }
        const whereClause = whereConditions.length > 0 ? (0, drizzle_orm_1.and)(...whereConditions) : undefined;
        const productsWithRelations = await db_1.db
            .select({
            id: db_1.products.id,
            name: db_1.products.name,
            nameVi: db_1.products.nameVi,
            sku: db_1.products.sku,
            description: db_1.products.description,
            descriptionVi: db_1.products.descriptionVi,
            price: db_1.products.price,
            specifications: db_1.products.specifications,
            features: db_1.products.features,
            images: db_1.products.images,
            stock: db_1.products.stock,
            isActive: db_1.products.isActive,
            createdAt: db_1.products.createdAt,
            updatedAt: db_1.products.updatedAt,
            category: {
                id: db_1.categories.id,
                name: db_1.categories.name,
                nameVi: db_1.categories.nameVi,
            },
            color: {
                id: db_1.colors.id,
                name: db_1.colors.name,
                nameVi: db_1.colors.nameVi,
                code: db_1.colors.code,
                hexColor: db_1.colors.hexColor,
            },
        })
            .from(db_1.products)
            .leftJoin(db_1.categories, (0, drizzle_orm_1.eq)(db_1.products.categoryId, db_1.categories.id))
            .leftJoin(db_1.colors, (0, drizzle_orm_1.eq)(db_1.products.colorId, db_1.colors.id))
            .where(whereClause)
            .orderBy((0, drizzle_orm_1.desc)(db_1.products.createdAt))
            .limit(limit)
            .offset(offset);
        const totalResult = await db_1.db
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(db_1.products)
            .where(whereClause);
        const total = totalResult[0].count;
        const totalPages = Math.ceil(total / limit);
        res.json({
            data: productsWithRelations,
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
        res.status(500).json({ error: 'Failed to fetch products' });
        return;
    }
});
router.get('/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const productWithRelations = await db_1.db
            .select({
            id: db_1.products.id,
            name: db_1.products.name,
            nameVi: db_1.products.nameVi,
            sku: db_1.products.sku,
            description: db_1.products.description,
            descriptionVi: db_1.products.descriptionVi,
            price: db_1.products.price,
            specifications: db_1.products.specifications,
            features: db_1.products.features,
            images: db_1.products.images,
            stock: db_1.products.stock,
            isActive: db_1.products.isActive,
            createdAt: db_1.products.createdAt,
            updatedAt: db_1.products.updatedAt,
            category: {
                id: db_1.categories.id,
                name: db_1.categories.name,
                nameVi: db_1.categories.nameVi,
            },
            color: {
                id: db_1.colors.id,
                name: db_1.colors.name,
                nameVi: db_1.colors.nameVi,
                code: db_1.colors.code,
                hexColor: db_1.colors.hexColor,
            },
        })
            .from(db_1.products)
            .leftJoin(db_1.categories, (0, drizzle_orm_1.eq)(db_1.products.categoryId, db_1.categories.id))
            .leftJoin(db_1.colors, (0, drizzle_orm_1.eq)(db_1.products.colorId, db_1.colors.id))
            .where((0, drizzle_orm_1.eq)(db_1.products.id, productId))
            .limit(1);
        if (!productWithRelations.length) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json(productWithRelations[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch product' });
        return;
    }
});
router.post('/', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin', 'editor']), async (req, res) => {
    try {
        const { name, nameVi, sku, description, descriptionVi, categoryId, colorId, price, specifications, features, images, stock, isActive, } = req.body;
        if (!name || !nameVi || !sku) {
            res.status(400).json({ error: 'Name, nameVi, and SKU are required' });
            return;
        }
        const newProduct = await db_1.db.insert(db_1.products).values({
            name,
            nameVi,
            sku,
            description,
            descriptionVi,
            categoryId,
            colorId,
            price,
            specifications,
            features,
            images,
            stock: stock || 0,
            isActive: isActive ?? true,
        }).returning();
        res.status(201).json(newProduct[0]);
    }
    catch (error) {
        console.error('Error creating product:', error);
        if (error.code === '23505') {
            res.status(400).json({ error: 'Product with this SKU already exists' });
        }
        else {
            res.status(500).json({ error: 'Failed to create product' });
        }
    }
});
router.put('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin', 'editor']), async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const updateData = { ...req.body, updatedAt: new Date() };
        const updatedProduct = await db_1.db.update(db_1.products)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(db_1.products.id, productId))
            .returning();
        if (!updatedProduct.length) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json(updatedProduct[0]);
    }
    catch (error) {
        console.error('Error updating product:', error);
        if (error.code === '23505') {
            res.status(400).json({ error: 'Product with this SKU already exists' });
        }
        else {
            res.status(500).json({ error: 'Failed to update product' });
        }
    }
});
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const deletedProduct = await db_1.db.delete(db_1.products)
            .where((0, drizzle_orm_1.eq)(db_1.products.id, productId))
            .returning();
        if (!deletedProduct.length) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete product' });
        return;
    }
});
exports.default = router;
//# sourceMappingURL=products.js.map