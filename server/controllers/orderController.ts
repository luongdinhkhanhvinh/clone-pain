import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { db } from '../db';
import { orderItems, orders, products, productVariants } from '../db/schema';
import { ApiError, catchAsync } from '../middleware/error';

type User = {
  id: string;
  role?: string;
  email?: string;
};

type OrderItemInput = {
  productId: string;
  variantId?: string;
  quantity: number;
  productName: string;
  variantName?: string;
  price: number;
};

type OrderInput = {
  items: OrderItemInput[];
  shippingAddress: any;
  billingAddress: any;
  customerNote?: string;
};

// Types
interface OrderItemData {
  orderId: string;
  productId: string;
  variantId: string | null;
  productName: string;
  variantName: string | null;
  quantity: number;
  price: string;
  totalPrice: string;
}

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = catchAsync(async (req: Request & { user?: User }, res: Response, next: NextFunction) => {
  const { items, shippingAddress, billingAddress, customerNote } = req.body as OrderInput;
  const userId = req.user?.id;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return next(new ApiError(400, 'Order must contain at least one item'));
  }
  
  // Validate and process order items
  let subtotal = 0;
  const orderItemsData: OrderItemData[] = [];
  
  for (const item of items) {
    const { productId, variantId, quantity } = item;
    
    if (!productId || !quantity || quantity <= 0) {
      return next(new ApiError(400, 'Invalid order item data'));
    }
    
    // Get product details with variant if provided
    type ProductWithVariant = {
      id: string;
      name: string;
      price: string;
      status: string | null;
      variantId?: string | null;
      variantName?: string | null;
      variantPrice?: string | null;
      variantStock?: number | null;
    };

    let product: ProductWithVariant;

    if (variantId) {
      // Get product with variant details
      const result = await db
        .select({
          id: products.id,
          name: products.name,
          price: products.price,
          status: products.status,
          variantId: productVariants.id,
          variantName: productVariants.name,
          variantPrice: productVariants.priceAdjustment,
          variantStock: productVariants.stockQuantity
        })
        .from(products)
        .leftJoin(
          productVariants,
          and(
            eq(productVariants.id, variantId),
            eq(productVariants.productId, productId)
          )
        )
        .where(eq(products.id, productId));
      
      if (!result.length) {
        return next(new ApiError(404, `Product not found with ID: ${productId}`));
      }
      product = result[0];
    } else {
      // Get product without variant
      const result = await db
        .select({
          id: products.id,
          name: products.name,
          price: products.price,
          status: products.status
        })
        .from(products)
        .where(eq(products.id, productId));
      
      if (!result.length) {
        return next(new ApiError(404, `Product not found with ID: ${productId}`));
      }
      product = result[0];
    }
    
    if (!product) {
      return next(new ApiError(404, `Product not found with ID: ${productId}`));
    }
    
    if (product.status !== 'active') {
      return next(new ApiError(400, `Product ${product.name} is not available for purchase`));
    }
    
    // Calculate price with variant adjustment if applicable
    let price = Number(product.price);
    let variantName = '';
    let variantStock: number | null = null;
    
    if ('variantPrice' in product && product.variantPrice) {
      price += Number(product.variantPrice);
      variantName = product.variantName || '';
      variantStock = product.variantStock ?? null;
    }
    
    const totalPrice = price * quantity;
    subtotal += totalPrice;
    
    // Check stock if variant is provided
    if (variantId) {
      if (variantStock === null || variantStock === undefined) {
        return next(new ApiError(404, `Variant not found with ID: ${variantId}`));
      }
      
      if (variantStock < quantity) {
        return next(new ApiError(400, `Insufficient stock for ${product.name}${variantName ? ` (${variantName})` : ''}`));
      }
      
      // Update stock
      await db
        .update(productVariants)
        .set({
          stockQuantity: variantStock - quantity,
          updatedAt: new Date(),
        })
        .where(eq(productVariants.id, variantId));
    }
  }
  
  // Calculate taxes and shipping (simplified for example)
  const taxRate = 0.1; // 10% tax
  const taxAmount = subtotal * taxRate;
  const shippingCost = subtotal > 100 ? 0 : 10; // Free shipping for orders over $100
  const totalAmount = subtotal + taxAmount + shippingCost;
  
  // Generate order number
  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Create order in transaction
  const order = await db.transaction(async (tx) => {
    // Create order (let database generate the ID)
    const [newOrder] = await tx
      .insert(orders)
      .values({
        orderNumber,
        userId: userId || null,
        status: 'pending',
        subtotal: subtotal.toString(),
        taxAmount: taxAmount.toString(),
        shippingCost: shippingCost.toString(),
        totalAmount: totalAmount.toString(),
        paymentStatus: 'pending',
        shippingAddress: shippingAddress || null,
        billingAddress: billingAddress || shippingAddress || null,
        customerNote: customerNote || null,
      })
      .returning();
    
    // Update order items with order ID
    const orderItemsWithOrderId = orderItemsData.map(item => ({
      ...item,
      orderId: newOrder.id,
    }));
    
    await tx.insert(orderItems).values(orderItemsWithOrderId);
    
    return newOrder;
  });
  
  // TODO: Send order confirmation email
  
  res.status(201).json({
    success: true,
    data: order,
  });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = catchAsync(async (req: Request & { user?: User, params: { id: string } }, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const isAdmin = req.user?.role === 'admin';
  
  // Define the base selection
  const baseSelect = {
    id: orders.id,
    orderNumber: orders.orderNumber,
    userId: orders.userId,
    status: orders.status,
    subtotal: orders.subtotal,
    taxAmount: orders.taxAmount,
    shippingCost: orders.shippingCost,
    totalAmount: orders.totalAmount,
    paymentStatus: orders.paymentStatus,
    shippingAddress: orders.shippingAddress,
    billingAddress: orders.billingAddress,
    customerNote: orders.customerNote,
    createdAt: orders.createdAt,
    updatedAt: orders.updatedAt,
    items: sql`(
      SELECT COALESCE(JSON_AGG(
        json_build_object(
          'id', oi.id,
          'productId', oi.product_id,
          'variantId', oi.variant_id,
          'productName', oi.product_name,
          'variantName', oi.variant_name,
          'quantity', oi.quantity,
          'price', oi.price,
          'totalPrice', oi.total_price
        )
      ), '[]')
      FROM order_items oi
      WHERE oi.order_id = ${orders.id}
    )`
  };

  // Execute the appropriate query based on user role
  let order;
  if (!isAdmin && userId) {
    [order] = await db
      .select(baseSelect)
      .from(orders)
      .where(and(eq(orders.id, id), eq(orders.userId, userId)));
  } else {
    [order] = await db
      .select(baseSelect)
      .from(orders)
      .where(eq(orders.id, id));
  }
  
  if (!order) {
    return next(new ApiError(404, 'Order not found'));
  }
  
  res.status(200).json({
    success: true,
    data: order,
  });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = catchAsync(async (req: Request & { user: User, query: { page?: string; limit?: string } }, res: Response, next: NextFunction) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  
  const userId = req.user.id;
  
  // Get orders
  const ordersList = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      totalAmount: orders.totalAmount,
      paymentStatus: orders.paymentStatus,
      createdAt: orders.createdAt,
      itemCount: sql<number>`(
        SELECT COUNT(*)
        FROM order_items oi
        WHERE oi.order_id = ${orders.id}
      )`,
      firstItem: sql`(
        SELECT json_build_object(
          'name', oi.product_name,
          'quantity', oi.quantity,
          'image', (
            SELECT pi.url
            FROM product_images pi
            WHERE pi.product_id = oi.product_id
            AND (pi.variant_id = oi.variant_id OR pi.variant_id IS NULL)
            ORDER BY pi.is_primary DESC, pi.position
            LIMIT 1
          )
        )
        FROM order_items oi
        WHERE oi.order_id = ${orders.id}
        LIMIT 1
      )`
    })
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(Number(limit))
    .offset(offset);
  
  // Get total count for pagination
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(eq(orders.userId, userId));
  
  res.status(200).json({
    success: true,
    count: ordersList.length,
    total: Number(count),
    page: Number(page),
    pages: Math.ceil(Number(count) / Number(limit)),
    data: ordersList,
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = catchAsync(async (req: Request & { 
  user: User; 
  query: { 
    page?: string; 
    limit?: string;
    status?: string;
    paymentStatus?: string;
    sort?: string;
    search?: string;
  }; 
}, res: Response, next: NextFunction) => {
  const { 
    page = '1', 
    limit = '10', 
    status, 
    paymentStatus, 
    sort = 'newest',
    search
  } = req.query;
  
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const offset = (pageNum - 1) * limitNum;
  
  // Build base selection
  const baseSelect = {
    id: orders.id,
    orderNumber: orders.orderNumber,
    userId: orders.userId,
    userEmail: sql`(SELECT email FROM users WHERE id = ${orders.userId})`,
    status: orders.status,
    totalAmount: orders.totalAmount,
    paymentStatus: orders.paymentStatus,
    createdAt: orders.createdAt,
    updatedAt: orders.updatedAt,
    itemCount: sql<number>`(
      SELECT COUNT(*)
      FROM order_items oi
      WHERE oi.order_id = ${orders.id}
    )`
  };
  
  // Build where conditions
  const conditions = [];
  
  if (status) {
    conditions.push(eq(orders.status, status));
  }
  
  if (paymentStatus) {
    conditions.push(eq(orders.paymentStatus, paymentStatus));
  }
  
  if (search) {
    const searchTerm = `%${search}%`;
    conditions.push(
      sql`${orders.orderNumber}::text ILIKE ${searchTerm} OR 
      (SELECT email FROM users WHERE id = ${orders.userId})::text ILIKE ${searchTerm}`
    );
  }
  
  // Build order by
  let orderByClause;
  switch (sort) {
    case 'oldest':
      orderByClause = [asc(orders.createdAt)];
      break;
    case 'total_asc':
      orderByClause = [asc(orders.totalAmount)];
      break;
    case 'total_desc':
      orderByClause = [desc(orders.totalAmount)];
      break;
    case 'newest':
    default:
      orderByClause = [desc(orders.createdAt)];
      break;
  }
  
  // Execute query with filters and pagination
  const ordersQuery = db
    .select(baseSelect)
    .from(orders);
    
  if (conditions.length > 0) {
    ordersQuery.where(and(...conditions));
  }
  
  const ordersList = await ordersQuery
    .orderBy(...orderByClause)
    .limit(limitNum)
    .offset(offset);
  
  // Get total count with the same filters
  const countQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(orders);
    
  if (conditions.length > 0) {
    countQuery.where(and(...conditions));
  }
  
  const [{ count }] = await countQuery;
  
  res.status(200).json({
    success: true,
    count: ordersList.length,
    total: Number(count),
    page: pageNum,
    pages: Math.ceil(Number(count) / limitNum),
    data: ordersList,
  });
});

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = catchAsync(async (req: Request & { 
  params: { id: string };
  body: { status: string };
}, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return next(new ApiError(400, 'Status is required'));
  }
  
  let updatedOrder;
  
  try {
    updatedOrder = await db.transaction(async (tx) => {
      // First, check if order exists
      const [order] = await tx
        .select()
        .from(orders)
        .where(eq(orders.id, id));
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      // Then update the order status
      const [updated] = await tx
        .update(orders)
        .set({
          status,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, id))
        .returning();
      
      return updated;
    });
  } catch (error: any) {
    if (error.message === 'Order not found') {
      return next(new ApiError(404, 'Order not found'));
    }
    return next(new ApiError(500, 'Failed to update order status'));
  }
  
  // TODO: Send status update email to customer
  
  res.status(200).json({
    success: true,
    data: updatedOrder,
  });
});

// @desc    Update payment status (Admin)
// @route   PUT /api/orders/:id/payment-status
// @access  Private/Admin
export const updatePaymentStatus = catchAsync(async (req: Request & { 
  params: { id: string };
  body: { paymentStatus: string };
}, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;
  
  if (!paymentStatus) {
    return next(new ApiError(400, 'Payment status is required'));
  }
  
  let updatedOrder;
  
  try {
    updatedOrder = await db.transaction(async (tx) => {
      // First, check if order exists
      const [order] = await tx
        .select()
        .from(orders)
        .where(eq(orders.id, id));
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      // Then update the payment status
      const [updated] = await tx
        .update(orders)
        .set({
          paymentStatus,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, id))
        .returning();
      
      return updated;
    });
  } catch (error: any) {
    if (error.message === 'Order not found') {
      return next(new ApiError(404, 'Order not found'));
    }
    return next(new ApiError(500, 'Failed to update payment status'));
  }
  
  // TODO: Send payment status update email to customer if needed
  
  res.status(200).json({
    success: true,
    data: updatedOrder,
  });
});
