import { eq, sql } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { categories, productCategories } from '../db/schema';
import { ApiError, catchAsync } from '../middleware/error';

// Types
type DBCategory = typeof categories.$inferSelect;
type NewCategory = typeof categories.$inferInsert;

interface Category extends DBCategory {
  productCount: number;
  children?: Category[];
}

type CreateCategoryInput = {
  name: string;
  description?: string | null;
  parentId?: string | null;
  imageUrl?: string | null;
  isFeatured?: boolean;
};

type UpdateCategoryInput = Partial<CreateCategoryInput>;

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { featured } = req.query;
  
  const dbCategories = await db
    .select()
    .from(categories)
    .where(
      featured === 'true' 
        ? eq(categories.isFeatured, true) 
        : undefined
    );
    
  // Get product counts for each category
  const categoriesWithCounts = await Promise.all(
    dbCategories.map(async (category) => {
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)`.mapWith(Number) })
        .from(productCategories)
        .where(eq(productCategories.categoryId, category.id));
        
      return {
        ...category,
        productCount: count || 0,
        children: []
      } as Category;
    })
  );
  
  const categoriesList: Category[] = categoriesWithCounts;

  // Build category tree
  const buildTree = (parentId: string | null = null): Category[] => {
    return categoriesList
      .filter(category => 
        (parentId === null && !category.parentId) || 
        (parentId !== null && category.parentId === parentId)
      )
      .map(category => ({
        ...category,
        productCount: category.productCount || 0,
        children: buildTree(category.id)
      }));
  };

  const categoryTree = buildTree();
  
  res.status(200).json({
    success: true,
    data: categoryTree,
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id));
    
  if (!category) {
    return next(new ApiError(404, 'Category not found'));
  }
  
  // Get product count
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(productCategories)
    .where(eq(productCategories.categoryId, id));
    
  const categoryWithCount = {
    ...category,
    productCount: Number(count)
  };
  
  res.status(200).json({
    success: true,
    data: categoryWithCount
  });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, parentId, imageUrl, isFeatured } = req.body as CreateCategoryInput;
  
  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
    
  // Check if slug exists
  const [existing] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug));
    
  if (existing) {
    return next(new ApiError(400, 'Category with this name already exists'));
  }
  
  // Create category
  const [newCategory] = await db
    .insert(categories)
    .values({
      id: uuidv4(),
      name,
      slug,
      description: description || null,
      parentId: parentId || null,
      imageUrl: imageUrl || null,
      isFeatured: Boolean(isFeatured)
    })
    .returning()
    .then(rows => rows as DBCategory[]);
  
  if (!newCategory) {
    return next(new ApiError(500, 'Failed to create category'));
  }
  
  // Add productCount to match the Category type
  const categoryWithCount: Category = {
    ...newCategory,
    productCount: 0
  };
    
  res.status(201).json({
    success: true,
    data: categoryWithCount
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, description, parentId, imageUrl, isFeatured } = req.body as UpdateCategoryInput;
  
  // Check if category exists
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id));
    
  if (!category) {
    return next(new ApiError(404, 'Category not found'));
  }
  
  // Update category
  const [updatedCategory] = await db
    .update(categories)
    .set({
      name: name ?? category.name,
      description: description ?? category.description,
      parentId: parentId ?? category.parentId,
      imageUrl: imageUrl ?? category.imageUrl,
      isFeatured: isFeatured ?? category.isFeatured,
      updatedAt: new Date()
    })
    .where(eq(categories.id, id))
    .returning();
    
  res.status(200).json({
    success: true,
    data: updatedCategory
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  // Check if category exists
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id));
    
  if (!category) {
    return next(new ApiError(404, 'Category not found'));
  }
  
  // Check if category has products
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(productCategories)
    .where(eq(productCategories.categoryId, id));
    
  if (Number(count) > 0) {
    return next(new ApiError(400, 'Cannot delete category with associated products'));
  }
  
  // Check if category has children
  const [children] = await db
    .select()
    .from(categories)
    .where(eq(categories.parentId, id));
    
  if (children) {
    return next(new ApiError(400, 'Cannot delete category with subcategories'));
  }
  
  // Delete category
  await db
    .delete(categories)
    .where(eq(categories.id, id));
    
  res.status(204).json({
    success: true,
    data: null
  });
});
