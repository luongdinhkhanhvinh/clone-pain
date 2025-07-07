import express from 'express';
import { db, articles, categories } from '../db';
import { eq, desc, like, and, or, count } from 'drizzle-orm';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Get all articles with pagination and filters
router.get('/', async (req, res): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : null;
    const isPublished = req.query.isPublished;

    const offset = (page - 1) * limit;

    let whereConditions = [];

    if (search) {
      whereConditions.push(
        or(
          like(articles.title, `%${search}%`),
          like(articles.titleVi, `%${search}%`),
          like(articles.slug, `%${search}%`)
        )
      );
    }

    if (categoryId) {
      whereConditions.push(eq(articles.categoryId, categoryId));
    }

    if (isPublished !== undefined) {
      whereConditions.push(eq(articles.isPublished, isPublished === 'true'));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const articlesWithCategory = await db
      .select({
        id: articles.id,
        title: articles.title,
        titleVi: articles.titleVi,
        slug: articles.slug,
        excerpt: articles.excerpt,
        excerptVi: articles.excerptVi,
        content: articles.content,
        contentVi: articles.contentVi,
        featuredImage: articles.featuredImage,
        tags: articles.tags,
        metaTitle: articles.metaTitle,
        metaDescription: articles.metaDescription,
        isPublished: articles.isPublished,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          nameVi: categories.nameVi,
        },
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .where(whereClause)
      .orderBy(desc(articles.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalResult = await db
      .select({ count: count() })
      .from(articles)
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
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch articles' });
    return;
  }
});

// Get article by ID
router.get('/:id', async (req, res): Promise<void> => {
  try {
    const articleId = parseInt(req.params.id);
    const articleWithCategory = await db
      .select({
        id: articles.id,
        title: articles.title,
        titleVi: articles.titleVi,
        slug: articles.slug,
        excerpt: articles.excerpt,
        excerptVi: articles.excerptVi,
        content: articles.content,
        contentVi: articles.contentVi,
        featuredImage: articles.featuredImage,
        tags: articles.tags,
        metaTitle: articles.metaTitle,
        metaDescription: articles.metaDescription,
        isPublished: articles.isPublished,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          nameVi: categories.nameVi,
        },
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.id, articleId))
      .limit(1);

    if (!articleWithCategory.length) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    res.json(articleWithCategory[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch article' });
    return;
  }
});

// Create new article
router.post('/', authenticateToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const {
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
      isPublished,
    } = req.body;

    if (!title || !titleVi || !slug || !content || !contentVi) {
      res.status(400).json({ error: 'Title, titleVi, slug, content, and contentVi are required' });
      return;
    }

    const newArticle = await db.insert(articles).values({
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
  } catch (error) {
    console.error('Error creating article:', error);
    if ((error as any).code === '23505') {
      res.status(400).json({ error: 'Article with this slug already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create article' });
    }
  }
});

// Update article
router.put('/:id', authenticateToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const updateData = { ...req.body, updatedAt: new Date() };

    // If publishing for the first time, set publishedAt
    if (updateData.isPublished && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const updatedArticle = await db.update(articles)
      .set(updateData)
      .where(eq(articles.id, articleId))
      .returning();

    if (!updatedArticle.length) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    res.json(updatedArticle[0]);
  } catch (error) {
    console.error('Error updating article:', error);
    if ((error as any).code === '23505') {
      res.status(400).json({ error: 'Article with this slug already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update article' });
    }
  }
});

// Delete article
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);

    const deletedArticle = await db.delete(articles)
      .where(eq(articles.id, articleId))
      .returning();

    if (!deletedArticle.length) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete article' });
    return;
  }
});

export default router;
