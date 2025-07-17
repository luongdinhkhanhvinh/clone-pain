import { eq } from 'drizzle-orm';
import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { articles } from '../db/schema';
import { ApiError, catchAsync } from '../middleware/error';

// GET /api/articles
export const getAllArticles = catchAsync(async (req: Request, res: Response) => {
  const allArticles = await db.select().from(articles);
  res.status(200).json({ success: true, data: allArticles });
});

// GET /api/articles/:id
export const getArticleById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const [article] = await db.select().from(articles).where(eq(articles.id, id));
  if (!article) return next(new ApiError(404, 'Article not found'));
  res.status(200).json({ success: true, data: article });
});

// POST /api/articles
export const createArticle = catchAsync(async (req: Request, res: Response) => {
  const { title, titleVi, slug, excerpt, excerptVi, content, contentVi, status, authorId, publishedAt } = req.body;
  const [newArticle] = await db.insert(articles).values({
    title,
    titleVi,
    slug,
    excerpt,
    excerptVi,
    content,
    contentVi,
    status,
    authorId,
    publishedAt,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();
  res.status(201).json({ success: true, data: newArticle });
});

// PUT /api/articles/:id
export const updateArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const [article] = await db.select().from(articles).where(eq(articles.id, id));
  if (!article) return next(new ApiError(404, 'Article not found'));
  const { title, titleVi, slug, excerpt, excerptVi, content, contentVi, status, authorId, publishedAt } = req.body;
  const [updatedArticle] = await db.update(articles).set({
    title,
    titleVi,
    slug,
    excerpt,
    excerptVi,
    content,
    contentVi,
    status,
    authorId,
    publishedAt,
    updatedAt: new Date(),
  }).where(eq(articles.id, id)).returning();
  res.status(200).json({ success: true, data: updatedArticle });
});

// DELETE /api/articles/:id
export const deleteArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const [article] = await db.select().from(articles).where(eq(articles.id, id));
  if (!article) return next(new ApiError(404, 'Article not found'));
  await db.delete(articles).where(eq(articles.id, id));
  res.status(204).send();
}); 