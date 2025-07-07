"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articlesRelations = exports.productsRelations = exports.colorsRelations = exports.categoriesRelations = exports.adminUsers = exports.contacts = exports.articles = exports.products = exports.colors = exports.categories = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.categories = (0, pg_core_1.pgTable)('categories', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(),
    nameVi: (0, pg_core_1.varchar)('name_vi', { length: 100 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    descriptionVi: (0, pg_core_1.text)('description_vi'),
    slug: (0, pg_core_1.varchar)('slug', { length: 100 }).notNull().unique(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.colors = (0, pg_core_1.pgTable)('colors', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(),
    nameVi: (0, pg_core_1.varchar)('name_vi', { length: 100 }).notNull(),
    code: (0, pg_core_1.varchar)('code', { length: 20 }).notNull().unique(),
    hexColor: (0, pg_core_1.varchar)('hex_color', { length: 7 }).notNull(),
    categoryId: (0, pg_core_1.integer)('category_id').references(() => exports.categories.id),
    description: (0, pg_core_1.text)('description'),
    descriptionVi: (0, pg_core_1.text)('description_vi'),
    marketingCopy: (0, pg_core_1.text)('marketing_copy'),
    marketingCopyVi: (0, pg_core_1.text)('marketing_copy_vi'),
    technicalInfo: (0, pg_core_1.jsonb)('technical_info'),
    applications: (0, pg_core_1.jsonb)('applications'),
    combinations: (0, pg_core_1.jsonb)('combinations'),
    imageUrl: (0, pg_core_1.varchar)('image_url', { length: 255 }),
    popularity: (0, pg_core_1.integer)('popularity').default(0),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.products = (0, pg_core_1.pgTable)('products', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 200 }).notNull(),
    nameVi: (0, pg_core_1.varchar)('name_vi', { length: 200 }).notNull(),
    sku: (0, pg_core_1.varchar)('sku', { length: 50 }).notNull().unique(),
    description: (0, pg_core_1.text)('description'),
    descriptionVi: (0, pg_core_1.text)('description_vi'),
    categoryId: (0, pg_core_1.integer)('category_id').references(() => exports.categories.id),
    colorId: (0, pg_core_1.integer)('color_id').references(() => exports.colors.id),
    price: (0, pg_core_1.decimal)('price', { precision: 10, scale: 2 }),
    specifications: (0, pg_core_1.jsonb)('specifications'),
    features: (0, pg_core_1.jsonb)('features'),
    images: (0, pg_core_1.jsonb)('images'),
    stock: (0, pg_core_1.integer)('stock').default(0),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.articles = (0, pg_core_1.pgTable)('articles', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    titleVi: (0, pg_core_1.varchar)('title_vi', { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)('slug', { length: 255 }).notNull().unique(),
    excerpt: (0, pg_core_1.text)('excerpt'),
    excerptVi: (0, pg_core_1.text)('excerpt_vi'),
    content: (0, pg_core_1.text)('content').notNull(),
    contentVi: (0, pg_core_1.text)('content_vi').notNull(),
    featuredImage: (0, pg_core_1.varchar)('featured_image', { length: 255 }),
    categoryId: (0, pg_core_1.integer)('category_id').references(() => exports.categories.id),
    tags: (0, pg_core_1.jsonb)('tags'),
    metaTitle: (0, pg_core_1.varchar)('meta_title', { length: 255 }),
    metaDescription: (0, pg_core_1.text)('meta_description'),
    isPublished: (0, pg_core_1.boolean)('is_published').default(false),
    publishedAt: (0, pg_core_1.timestamp)('published_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.contacts = (0, pg_core_1.pgTable)('contacts', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    firstName: (0, pg_core_1.varchar)('first_name', { length: 100 }).notNull(),
    lastName: (0, pg_core_1.varchar)('last_name', { length: 100 }).notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull(),
    phone: (0, pg_core_1.varchar)('phone', { length: 20 }),
    company: (0, pg_core_1.varchar)('company', { length: 200 }),
    subject: (0, pg_core_1.varchar)('subject', { length: 255 }),
    message: (0, pg_core_1.text)('message').notNull(),
    source: (0, pg_core_1.varchar)('source', { length: 50 }),
    metadata: (0, pg_core_1.jsonb)('metadata'),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('new'),
    assignedTo: (0, pg_core_1.varchar)('assigned_to', { length: 100 }),
    notes: (0, pg_core_1.text)('notes'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.adminUsers = (0, pg_core_1.pgTable)('admin_users', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    username: (0, pg_core_1.varchar)('username', { length: 50 }).notNull().unique(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    passwordHash: (0, pg_core_1.varchar)('password_hash', { length: 255 }).notNull(),
    firstName: (0, pg_core_1.varchar)('first_name', { length: 100 }),
    lastName: (0, pg_core_1.varchar)('last_name', { length: 100 }),
    role: (0, pg_core_1.varchar)('role', { length: 20 }).default('admin'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    lastLogin: (0, pg_core_1.timestamp)('last_login'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.categoriesRelations = (0, drizzle_orm_1.relations)(exports.categories, ({ many }) => ({
    colors: many(exports.colors),
    products: many(exports.products),
    articles: many(exports.articles),
}));
exports.colorsRelations = (0, drizzle_orm_1.relations)(exports.colors, ({ one, many }) => ({
    category: one(exports.categories, {
        fields: [exports.colors.categoryId],
        references: [exports.categories.id],
    }),
    products: many(exports.products),
}));
exports.productsRelations = (0, drizzle_orm_1.relations)(exports.products, ({ one }) => ({
    category: one(exports.categories, {
        fields: [exports.products.categoryId],
        references: [exports.categories.id],
    }),
    color: one(exports.colors, {
        fields: [exports.products.colorId],
        references: [exports.colors.id],
    }),
}));
exports.articlesRelations = (0, drizzle_orm_1.relations)(exports.articles, ({ one }) => ({
    category: one(exports.categories, {
        fields: [exports.articles.categoryId],
        references: [exports.categories.id],
    }),
}));
//# sourceMappingURL=schema.js.map