import express from 'express';
import { db, categories, colors, products, articles } from '../db';
import { eq, desc, count, sql } from 'drizzle-orm';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Get all categories with counts
router.get('/', async (req, res): Promise<void> => {
  try {
    const categoriesWithCounts = await db
      .select({
        id: categories.id,
        name: categories.name,
        nameVi: categories.nameVi,
        description: categories.description,
        descriptionVi: categories.descriptionVi,
        slug: categories.slug,
        isActive: categories.isActive,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        colorsCount: count(colors.id),
        productsCount: count(products.id),
        articlesCount: count(articles.id),
      })
      .from(categories)
      .leftJoin(colors, eq(categories.id, colors.categoryId))
      .leftJoin(products, eq(categories.id, products.categoryId))
      .leftJoin(articles, eq(categories.id, articles.categoryId))
      .groupBy(categories.id)
      .orderBy(desc(categories.createdAt));

    res.json(categoriesWithCounts);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch categories' });
    return;
  }
});

// Get category by ID
router.get('/:id', async (req, res): Promise<void> => {
  try {
    const categoryId = parseInt(req.params.id);
    const category = await db.select().from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (!category.length) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.json(category[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch category' });
    return;
  }
});

// Create new category
router.post('/', authenticateToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { name, nameVi, description, descriptionVi, slug, isActive } = req.body;

    if (!name || !nameVi || !slug) {
      res.status(400).json({ error: 'Name, nameVi, and slug are required' });
      return;
    }

    const newCategory = await db.insert(categories).values({
      name,
      nameVi,
      description,
      descriptionVi,
      slug,
      isActive: isActive ?? true,
    }).returning();

    res.status(201).json(newCategory[0]);
  } catch (error: any) {
    console.error('Error creating category:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: 'Category with this slug already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create category' });
    }
  }
});

// Update category
router.put('/:id', authenticateToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const { name, nameVi, description, descriptionVi, slug, isActive } = req.body;

    const updatedCategory = await db.update(categories)
      .set({
        name,
        nameVi,
        description,
        descriptionVi,
        slug,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, categoryId))
      .returning();

    if (!updatedCategory.length) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.json(updatedCategory[0]);
  } catch (error: any) {
    console.error('Error updating category:', error);
    if (error.code === '23505') {
      res.status(400).json({ error: 'Category with this slug already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update category' });
    }
  }
});

// Delete category
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);

    // Check if category has associated items
    const colorsCount = await db.select({ count: count() }).from(colors)
      .where(eq(colors.categoryId, categoryId));
    const productsCount = await db.select({ count: count() }).from(products)
      .where(eq(products.categoryId, categoryId));
    const articlesCount = await db.select({ count: count() }).from(articles)
      .where(eq(articles.categoryId, categoryId));

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

    const deletedCategory = await db.delete(categories)
      .where(eq(categories.id, categoryId))
      .returning();

    if (!deletedCategory.length) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete category' });
    return;
  }
});

export default router;
