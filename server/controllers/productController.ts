import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { products, productVariants, productImages, productCategories, categories } from '../db/schema';
import { and, eq, inArray, sql, desc, asc, like, or, SQL } from 'drizzle-orm';
import { ApiError, catchAsync } from '../middleware/error';
import { v4 as uuidv4 } from 'uuid';

type User = {
  id: string;
  role?: string;
};

type ProductVariant = {
  id: string;
  sku: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  costPerItem: number | null;
  quantity: number;
  barcode: string | null;
  weight: number | null;
  height: number | null;
  width: number | null;
  length: number | null;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
  isPrimary: boolean;
  position: number;
  variantId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Define the product query result type
type ProductWithRelations = {
  id: string;
  sku: string | null;
  name: string;
  description: string | null;
  price: string;
  compareAtPrice: string | null;
  costPerItem: string | null;
  status: string;
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
  variants: Array<{
    id: string;
    sku: string | null;
    name: string | null;
    priceAdjustment: string | null;
    stockQuantity: number;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
    images: Array<{
      id: string;
      url: string;
      altText: string | null;
      isPrimary: boolean;
      position: number;
    }>;
  }>;
  images: Array<{
    id: string;
    url: string;
    altText: string | null;
    isPrimary: boolean;
    position: number;
    variantId: string | null;
  }>;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
};

// Helper function to build product query with variants and images
const buildProductQuery = (productId?: string) => {
  // Define the base query with all fields and SQL subqueries
  const baseQuery = db.select({
      id: products.id,
      sku: products.sku,
      name: products.name,
      description: products.description,
      price: products.price,
      compareAtPrice: products.compareAtPrice,
      costPerItem: products.costPerItem,
      status: products.status,
      isFeatured: products.isFeatured,
      isBestseller: products.isBestseller,
      isNew: products.isNew,
      seoTitle: products.seoTitle,
      seoDescription: products.seoDescription,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      variants: sql`(
        SELECT COALESCE(JSON_AGG(
          json_build_object(
            'id', v.id,
            'sku', v.sku,
            'name', v.name,
            'priceAdjustment', v.price_adjustment,
            'stockQuantity', v.stock_quantity,
            'isDefault', v.is_default,
            'createdAt', v.created_at,
            'updatedAt', v.updated_at,
            'images', (
              SELECT COALESCE(JSON_AGG(
                json_build_object(
                  'id', pi.id,
                  'url', pi.url,
                  'altText', pi.alt_text,
                  'isPrimary', pi.is_primary,
                  'position', pi.position
                ) ORDER BY pi.position ASC
              ), '[]')
              FROM product_images pi
              WHERE pi.variant_id = v.id
            )
          )
        ), '[]')
        FROM product_variants v
        WHERE v.product_id = ${productId || products.id}
      )`,
      categories: sql`(
        SELECT COALESCE(JSON_AGG(
          json_build_object(
            'id', c.id,
            'name', c.name,
            'slug', c.slug
          )
        ), '[]')
        FROM categories c
        INNER JOIN product_categories pc ON c.id = pc.category_id
        WHERE pc.product_id = ${productId || products.id}
      )`
    })
    .from(products);
    
  return baseQuery;
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { 
    page = 1, 
    limit = 10, 
    category, 
    search, 
    status, 
    featured, 
    sort = 'newest' 
  } = req.query;

  const offset = (Number(page) - 1) * Number(limit);
  
  // Build conditions array
  const conditions = [];
  
  if (category) {
    conditions.push(
      sql`${products.id} IN (
        SELECT product_id FROM product_categories 
        WHERE category_id = ${category}
      )`
    );
  }
  
  if (search) {
    const searchTerm = `%${search}%`;
    conditions.push(
      or(
        like(products.name, searchTerm),
        like(products.description, searchTerm),
        like(products.sku, searchTerm)
      )
    );
  }
  
  if (status) {
    conditions.push(eq(products.status, status as string));
  }
  
  if (featured === 'true') {
    conditions.push(eq(products.isFeatured, true));
  }
  
  // Determine sort order
  let orderBy;
  switch (sort) {
    case 'price_asc':
      orderBy = asc(products.price);
      break;
    case 'price_desc':
      orderBy = desc(products.price);
      break;
    case 'name_asc':
      orderBy = asc(products.name);
      break;
    case 'name_desc':
      orderBy = desc(products.name);
      break;
    case 'newest':
    default:
      orderBy = desc(products.createdAt);
      break;
  }
  
  // Execute query with all conditions
  const query = buildProductQuery()
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(orderBy)
    .limit(Number(limit))
    .offset(offset);
  
  const productsList = await query;
  
  // Get total count for pagination
  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(products);
  
  res.status(200).json({
    success: true,
    count: productsList.length,
    total: Number(count),
    page: Number(page),
    pages: Math.ceil(Number(count) / Number(limit)),
    data: productsList,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  const [product] = await buildProductQuery(id).where(eq(products.id, id)).execute();
  
  if (!product) {
    return next(new ApiError(404, 'Product not found'));
  }
  
  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const {
    name,
    nameVi,
    description,
    descriptionVi,
    price,
    categoryId,
    colorId,
    isActive = true,
    stock = 0,
    compareAtPrice,
    costPerItem,
    status = 'draft',
    isFeatured = false,
    isBestseller = false,
    isNew = false,
    seoTitle,
    seoDescription,
    variants = [],
    categoryIds = [],
  } = req.body;
  
  // Generate SKU if not provided
  const sku = req.body.sku || `PROD-${Date.now()}`;
  
  // Start transaction
  const result = await db.transaction(async (tx) => {
    // Create product
    const [product] = await tx
      .insert(products)
      .values({
        id: uuidv4(),
        sku,
        name,
        nameVi,
        description,
        descriptionVi,
        price,
        categoryId,
        colorId,
        isActive,
        stock,
        compareAtPrice,
        costPerItem,
        status,
        isFeatured,
        isBestseller,
        isNew,
        seoTitle,
        seoDescription,
      })
      .returning();
    
    // Create variants if any
    if (variants && variants.length > 0) {
      const variantValues = variants.map((variant: any) => ({
        id: variant.id || uuidv4(),
        productId: product.id,
        sku: variant.sku || `${sku}-${Math.random().toString(36).substring(2, 8)}`,
        name: variant.name,
        priceAdjustment: variant.priceAdjustment || 0,
        stockQuantity: variant.stockQuantity || 0,
        isDefault: variant.isDefault || false,
      }));
      
      await tx.insert(productVariants).values(variantValues);
      
      // Handle variant images
      const imageInserts = [];
      for (const variant of variants) {
        if (variant.images && variant.images.length > 0) {
          const variantId = variant.id || variantValues.find((v: any) => v.sku === variant.sku)?.id;
          if (variantId) {
            for (const [index, image] of variant.images.entries()) {
              imageInserts.push({
                id: uuidv4(),
                productId: product.id,
                variantId,
                url: image.url,
                altText: image.altText || '',
                isPrimary: image.isPrimary || false,
                position: image.position || index,
              });
            }
          }
        }
      }
      
      if (imageInserts.length > 0) {
        await tx.insert(productImages).values(imageInserts);
      }
    }
    
    // Assign categories
    if (categoryIds.length > 0) {
      const productCategoryInserts = categoryIds.map((categoryId: string) => ({
        productId: product.id,
        categoryId,
      }));
      
      await tx.insert(productCategories).values(productCategoryInserts);
    }
    
    return product.id;
  });
  
  // Fetch the complete product with relations
  const [product] = await buildProductQuery(result).where(eq(products.id, result)).execute();
  
  res.status(201).json({
    success: true,
    data: product,
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  // Check if product exists
  const [existingProduct] = await db.select().from(products).where(eq(products.id, id));
  
  if (!existingProduct) {
    return next(new ApiError(404, 'Product not found'));
  }
  
  const {
    name,
    nameVi,
    description,
    descriptionVi,
    price,
    categoryId,
    colorId,
    isActive,
    stock,
    compareAtPrice,
    costPerItem,
    status,
    isFeatured,
    isBestseller,
    isNew,
    seoTitle,
    seoDescription,
    variants = [],
    categoryIds = [],
  } = req.body;
  
  // Start transaction
  await db.transaction(async (tx) => {
    // Update product
    await tx
      .update(products)
      .set({
        name,
        nameVi,
        description,
        descriptionVi,
        price,
        categoryId,
        colorId,
        isActive,
        stock,
        compareAtPrice,
        costPerItem,
        status,
        isFeatured,
        isBestseller,
        isNew,
        seoTitle,
        seoDescription,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id));
    
    // Handle variants
    if (variants && variants.length > 0) {
      const existingVariantIds = (await tx
        .select({ id: productVariants.id })
        .from(productVariants)
        .where(eq(productVariants.productId, id))).map(v => v.id);
      
      const incomingVariantIds = variants
        .filter((v: any) => v.id)
        .map((v: any) => v.id);
      
      // Delete variants that are not in the incoming list
      const variantsToDelete = existingVariantIds.filter(id => !incomingVariantIds.includes(id));
      if (variantsToDelete.length > 0) {
        await tx
          .delete(productVariants)
          .where(inArray(productVariants.id, variantsToDelete));
      }
      
      // Update or create variants
      for (const variant of variants) {
        const variantData = {
          sku: variant.sku,
          name: variant.name,
          priceAdjustment: variant.priceAdjustment || 0,
          stockQuantity: variant.stockQuantity || 0,
          isDefault: variant.isDefault || false,
          updatedAt: new Date(),
        };
        
        if (variant.id) {
          // Update existing variant
          await tx
            .update(productVariants)
            .set(variantData)
            .where(eq(productVariants.id, variant.id));
        } else {
          // Create new variant
          await tx.insert(productVariants).values({
            id: uuidv4(),
            productId: id,
            ...variantData,
          });
        }
      }
    }
    
    // Update categories
    if (categoryIds) {
      // Delete all existing category associations
      await tx
        .delete(productCategories)
        .where(eq(productCategories.productId, id));
      
      // Add new category associations
      if (categoryIds.length > 0) {
        const productCategoryInserts = categoryIds.map((categoryId: string) => ({
          productId: id,
          categoryId,
        }));
        
        await tx.insert(productCategories).values(productCategoryInserts);
      }
    }
  });
  
  // Fetch the updated product with relations
  const [product] = await buildProductQuery(id).where(eq(products.id, id)).execute();
  
  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  // Check if product exists
  const [product] = await db.select().from(products).where(eq(products.id, id));
  
  if (!product) {
    return next(new ApiError(404, 'Product not found'));
  }
  
  // Delete product (cascades to variants, images, and category associations)
  await db.delete(products).where(eq(products.id, id));
  
  res.status(200).json({
    success: true,
    data: {},
  });
});
