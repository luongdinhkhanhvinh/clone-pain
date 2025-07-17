import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { pages } from '../db/schema';
import { eq, and, or, sql } from 'drizzle-orm';
import { ApiError, catchAsync } from '../middleware/error';
import { v4 as uuidv4 } from 'uuid';

// @desc    Get all pages
// @route   GET /api/pages
// @access  Public
export const getPages = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { isPublished, search } = req.query;
  
  const conditions = [];
  
  // Build conditions array
  if (isPublished === 'true') {
    conditions.push(eq(pages.isPublished, true));
  } else if (isPublished === 'false') {
    conditions.push(eq(pages.isPublished, false));
  }
  
  if (search) {
    const searchTerm = `%${search}%`;
    conditions.push(
      or(
        sql`${pages.title} ILIKE ${searchTerm}`,
        sql`${pages.content}::text ILIKE ${searchTerm}`
      )
    );
  }
  
  // Build and execute query
  const pagesList = await db
    .select({
      id: pages.id,
      title: pages.title,
      slug: pages.slug,
      seoTitle: pages.seoTitle,
      seoDescription: pages.seoDescription,
      isPublished: pages.isPublished,
      publishedAt: pages.publishedAt,
      createdAt: pages.createdAt,
      updatedAt: pages.updatedAt,
    })
    .from(pages)
    .where(conditions.length > 0 ? and(...conditions) : undefined);
  
  res.status(200).json({
    success: true,
    count: pagesList.length,
    data: pagesList,
  });
});

// @desc    Get single page by ID or slug
// @route   GET /api/pages/:idOrSlug
// @access  Public
export const getPage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { idOrSlug } = req.params;
  const isAdmin = req.user?.role === 'admin';
  
  // Check if the parameter is a UUID or a slug
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug);
  
  const conditions = [];

  // Add condition based on whether it's a UUID or slug
  if (isUuid) {
    conditions.push(eq(pages.id, idOrSlug));
  } else {
    conditions.push(eq(pages.slug, idOrSlug));
  }
  
  // Non-admin users can only see published pages
  if (!isAdmin) {
    conditions.push(eq(pages.isPublished, true));
  }
  
  const [page] = await db
    .select({
      id: pages.id,
      title: pages.title,
      slug: pages.slug,
      content: pages.content,
      seoTitle: pages.seoTitle,
      seoDescription: pages.seoDescription,
      isPublished: pages.isPublished,
      publishedAt: pages.publishedAt,
      createdAt: pages.createdAt,
      updatedAt: pages.updatedAt,
    })
    .from(pages)
    .where(and(...conditions));
  
  if (!page) {
    return next(new ApiError(404, 'Page not found'));
  }
  
  res.status(200).json({
    success: true,
    data: page,
  });
});

// @desc    Create new page
// @route   POST /api/pages
// @access  Private/Admin
export const createPage = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const { title, content, seoTitle, seoDescription, isPublished = false } = req.body;
  
  if (!title) {
    return next(new ApiError(400, 'Title is required'));
  }
  
  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
  
  // Check if slug already exists
  const [existingPage] = await db
    .select()
    .from(pages)
    .where(eq(pages.slug, slug));
  
  if (existingPage) {
    return next(new ApiError(400, 'Page with this title already exists'));
  }
  
  // Create page
  const [newPage] = await db
    .insert(pages)
    .values({
      id: uuidv4(),
      title,
      slug,
      content: content || null,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || null,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    })
    .returning();
  
  res.status(201).json({
    success: true,
    data: newPage,
  });
});

// @desc    Update page
// @route   PUT /api/pages/:id
// @access  Private/Admin
export const updatePage = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { title, content, seoTitle, seoDescription, isPublished } = req.body;
  
  // Check if page exists
  const [page] = await db
    .select()
    .from(pages)
    .where(eq(pages.id, id));
  
  if (!page) {
    return next(new ApiError(404, 'Page not found'));
  }
  
  // Generate new slug if title changed
  let slug = page.slug;
  if (title && title !== page.title) {
    slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');
    
    // Check if new slug is already taken by another page
    const [existingPage] = await db
      .select()
      .from(pages)
      .where(and(eq(pages.slug, slug), sql`id != ${id}`));
    
    if (existingPage) {
      return next(new ApiError(400, 'Page with this title already exists'));
    }
  }
  
  // Prepare update data
  const updateData: any = {
    title: title || page.title,
    slug,
    content: content !== undefined ? content : page.content,
    seoTitle: seoTitle !== undefined ? seoTitle : page.seoTitle,
    seoDescription: seoDescription !== undefined ? seoDescription : page.seoDescription,
    updatedAt: new Date(),
  };
  
  // Handle publish/unpublish
  if (isPublished !== undefined) {
    updateData.isPublished = isPublished;
    if (isPublished && !page.publishedAt) {
      updateData.publishedAt = new Date();
    }
  }
  
  // Update page
  const [updatedPage] = await db
    .update(pages)
    .set(updateData)
    .where(eq(pages.id, id))
    .returning();
  
  res.status(200).json({
    success: true,
    data: updatedPage,
  });
});

// @desc    Delete page
// @route   DELETE /api/pages/:id
// @access  Private/Admin
export const deletePage = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  // Check if page exists
  const [page] = await db
    .select()
    .from(pages)
    .where(eq(pages.id, id));
  
  if (!page) {
    return next(new ApiError(404, 'Page not found'));
  }
  
  // Delete page
  await db
    .delete(pages)
    .where(eq(pages.id, id));
  
  res.status(200).json({
    success: true,
    data: {},
  });
});
