import express from 'express';
import { db, products, categories, colors } from '../db';
import { eq, desc, like, and, or, count } from 'drizzle-orm';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Get all products with pagination and filters
router.get('/', async (req, res): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : null;
    const colorId = req.query.colorId ? parseInt(req.query.colorId as string) : null;
    const isActive = req.query.isActive;

    const offset = (page - 1) * limit;

    let whereConditions = [];

    if (search) {
      whereConditions.push(
        or(
          like(products.name, `%${search}%`),
          like(products.nameVi, `%${search}%`),
          like(products.sku, `%${search}%`)
        )
      );
    }

    if (categoryId) {
      whereConditions.push(eq(products.categoryId, categoryId));
    }

    if (colorId) {
      whereConditions.push(eq(products.colorId, colorId));
    }

    if (isActive !== undefined) {
      whereConditions.push(eq(products.isActive, isActive === 'true'));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const productsWithRelations = await db
      .select({
        id: products.id,
        name: products.name,
        nameVi: products.nameVi,
        sku: products.sku,
        description: products.description,
        descriptionVi: products.descriptionVi,
        price: products.price,
        specifications: products.specifications,
        features: products.features,
        images: products.images,
        stock: products.stock,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          nameVi: categories.nameVi,
        },
        color: {
          id: colors.id,
          name: colors.name,
          nameVi: colors.nameVi,
          code: colors.code,
          hexColor: colors.hexColor,
        },
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(colors, eq(products.colorId, colors.id))
      .where(whereClause)
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalResult = await db
      .select({ count: count() })
      .from(products)
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
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
    return;
  }
});

// Get product by ID
router.get('/:id', async (req, res): Promise<void> => {
  try {
    const productId = parseInt(req.params.id);
    const productWithRelations = await db
      .select({
        id: products.id,
        name: products.name,
        nameVi: products.nameVi,
        sku: products.sku,
        description: products.description,
        descriptionVi: products.descriptionVi,
        price: products.price,
        specifications: products.specifications,
        features: products.features,
        images: products.images,
        stock: products.stock,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          nameVi: categories.nameVi,
        },
        color: {
          id: colors.id,
          name: colors.name,
          nameVi: colors.nameVi,
          code: colors.code,
          hexColor: colors.hexColor,
        },
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(colors, eq(products.colorId, colors.id))
      .where(eq(products.id, productId))
      .limit(1);

    if (!productWithRelations.length) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(productWithRelations[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product' });
    return;
  }
});

// Create new product
router.post('/', authenticateToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const {
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
      stock,
      isActive,
    } = req.body;

    if (!name || !nameVi || !sku) {
      res.status(400).json({ error: 'Name, nameVi, and SKU are required' });
      return;
    }

    const newProduct = await db.insert(products).values({
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
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error.code === '23505') {
      res.status(400).json({ error: 'Product with this SKU already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
});

// Update product
router.put('/:id', authenticateToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const updateData = { ...req.body, updatedAt: new Date() };

    const updatedProduct = await db.update(products)
      .set(updateData)
      .where(eq(products.id, productId))
      .returning();

    if (!updatedProduct.length) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(updatedProduct[0]);
  } catch (error: any) {
    console.error('Error updating product:', error);
    if (error.code === '23505') {
      res.status(400).json({ error: 'Product with this SKU already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update product' });
    }
  }
});

// Delete product
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const deletedProduct = await db.delete(products)
      .where(eq(products.id, productId))
      .returning();

    if (!deletedProduct.length) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete product' });
    return;
  }
});

export default router;
