import express from 'express';
import { db, colors, categories, products } from '../db';
import { eq, desc, like, and, or, count } from 'drizzle-orm';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Get all colors with pagination and filters
router.get('/', async (req, res): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : null;
    const isActive = req.query.isActive;

    const offset = (page - 1) * limit;

    let whereConditions = [];

    if (search) {
      whereConditions.push(
        or(
          like(colors.name, `%${search}%`),
          like(colors.nameVi, `%${search}%`),
          like(colors.code, `%${search}%`)
        )
      );
    }

    if (categoryId) {
      whereConditions.push(eq(colors.categoryId, categoryId));
    }

    if (isActive !== undefined) {
      whereConditions.push(eq(colors.isActive, isActive === 'true'));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const colorsWithCategory = await db
      .select({
        id: colors.id,
        name: colors.name,
        nameVi: colors.nameVi,
        code: colors.code,
        hexColor: colors.hexColor,
        description: colors.description,
        descriptionVi: colors.descriptionVi,
        marketingCopy: colors.marketingCopy,
        marketingCopyVi: colors.marketingCopyVi,
        technicalInfo: colors.technicalInfo,
        applications: colors.applications,
        combinations: colors.combinations,
        imageUrl: colors.imageUrl,
        popularity: colors.popularity,
        isActive: colors.isActive,
        createdAt: colors.createdAt,
        updatedAt: colors.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          nameVi: categories.nameVi,
        },
      })
      .from(colors)
      .leftJoin(categories, eq(colors.categoryId, categories.id))
      .where(whereClause)
      .orderBy(desc(colors.popularity), desc(colors.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalResult = await db
      .select({ count: count() })
      .from(colors)
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
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch colors' });
    return;
  }
});

// Get color by ID
router.get('/:id', async (req, res): Promise<void> => {
  try {
    const colorId = parseInt(req.params.id);
    const colorWithCategory = await db
      .select({
        id: colors.id,
        name: colors.name,
        nameVi: colors.nameVi,
        code: colors.code,
        hexColor: colors.hexColor,
        description: colors.description,
        descriptionVi: colors.descriptionVi,
        marketingCopy: colors.marketingCopy,
        marketingCopyVi: colors.marketingCopyVi,
        technicalInfo: colors.technicalInfo,
        applications: colors.applications,
        combinations: colors.combinations,
        imageUrl: colors.imageUrl,
        popularity: colors.popularity,
        isActive: colors.isActive,
        createdAt: colors.createdAt,
        updatedAt: colors.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          nameVi: categories.nameVi,
        },
      })
      .from(colors)
      .leftJoin(categories, eq(colors.categoryId, categories.id))
      .where(eq(colors.id, colorId))
      .limit(1);

    if (!colorWithCategory.length) {
      res.status(404).json({ error: 'Color not found' });
      return;
    }

    res.json(colorWithCategory[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch color' });
    return;
  }
});

// Create new color
router.post('/', authenticateToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const {
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
      popularity,
      isActive,
    } = req.body;

    if (!name || !nameVi || !code || !hexColor) {
      res.status(400).json({ error: 'Name, nameVi, code, and hexColor are required' });
      return;
    }

    const newColor = await db.insert(colors).values({
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
  } catch (error: any) {
    console.error('Error creating color:', error);
    if (error.code === '23505') {
      res.status(400).json({ error: 'Color with this code already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create color' });
    }
  }
});

// Update color
router.put('/:id', authenticateToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const colorId = parseInt(req.params.id);
    const updateData = { ...req.body, updatedAt: new Date() };

    const updatedColor = await db.update(colors)
      .set(updateData)
      .where(eq(colors.id, colorId))
      .returning();

    if (!updatedColor.length) {
      res.status(404).json({ error: 'Color not found' });
      return;
    }

    res.json(updatedColor[0]);
  } catch (error: any) {
    console.error('Error updating color:', error);
    if (error.code === '23505') {
      res.status(400).json({ error: 'Color with this code already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update color' });
    }
  }
});

// Delete color
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const colorId = parseInt(req.params.id);

    // Check if color has associated products
    const productsCount = await db.select({ count: count() }).from(products)
      .where(eq(products.colorId, colorId));

    if (productsCount[0].count > 0) {
      res.status(400).json({ 
        error: 'Cannot delete color with associated products',
        productsCount: productsCount[0].count,
      });
      return;
    }

    const deletedColor = await db.delete(colors)
      .where(eq(colors.id, colorId))
      .returning();

    if (!deletedColor.length) {
      res.status(404).json({ error: 'Color not found' });
      return;
    }

    res.json({ message: 'Color deleted successfully' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete color' });
    return;
  }
});

export default router;
