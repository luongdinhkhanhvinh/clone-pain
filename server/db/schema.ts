import { pgTable, serial, varchar, text, timestamp, boolean, integer, decimal, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Categories table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  nameVi: varchar('name_vi', { length: 100 }).notNull(),
  description: text('description'),
  descriptionVi: text('description_vi'),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Colors table
export const colors = pgTable('colors', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  nameVi: varchar('name_vi', { length: 100 }).notNull(),
  code: varchar('code', { length: 20 }).notNull().unique(),
  hexColor: varchar('hex_color', { length: 7 }).notNull(),
  categoryId: integer('category_id').references(() => categories.id),
  description: text('description'),
  descriptionVi: text('description_vi'),
  marketingCopy: text('marketing_copy'),
  marketingCopyVi: text('marketing_copy_vi'),
  technicalInfo: jsonb('technical_info'),
  applications: jsonb('applications'),
  combinations: jsonb('combinations'),
  imageUrl: varchar('image_url', { length: 255 }),
  popularity: integer('popularity').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Products table
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  nameVi: varchar('name_vi', { length: 200 }).notNull(),
  sku: varchar('sku', { length: 50 }).notNull().unique(),
  description: text('description'),
  descriptionVi: text('description_vi'),
  categoryId: integer('category_id').references(() => categories.id),
  colorId: integer('color_id').references(() => colors.id),
  price: decimal('price', { precision: 10, scale: 2 }),
  specifications: jsonb('specifications'),
  features: jsonb('features'),
  images: jsonb('images'),
  stock: integer('stock').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Articles/Blog posts table
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  titleVi: varchar('title_vi', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  excerpt: text('excerpt'),
  excerptVi: text('excerpt_vi'),
  content: text('content').notNull(),
  contentVi: text('content_vi').notNull(),
  featuredImage: varchar('featured_image', { length: 255 }),
  categoryId: integer('category_id').references(() => categories.id),
  tags: jsonb('tags'),
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Contact submissions table
export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  company: varchar('company', { length: 200 }),
  subject: varchar('subject', { length: 255 }),
  message: text('message').notNull(),
  source: varchar('source', { length: 50 }), // 'contact_form', 'color_inquiry', 'professional_application'
  metadata: jsonb('metadata'), // Additional form data
  status: varchar('status', { length: 20 }).default('new'), // 'new', 'in_progress', 'resolved', 'closed'
  assignedTo: varchar('assigned_to', { length: 100 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Admin users table
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  role: varchar('role', { length: 20 }).default('admin'), // 'admin', 'editor', 'viewer'
  isActive: boolean('is_active').default(true),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  colors: many(colors),
  products: many(products),
  articles: many(articles),
}));

export const colorsRelations = relations(colors, ({ one, many }) => ({
  category: one(categories, {
    fields: [colors.categoryId],
    references: [categories.id],
  }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  color: one(colors, {
    fields: [products.colorId],
    references: [colors.id],
  }),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
  category: one(categories, {
    fields: [articles.categoryId],
    references: [categories.id],
  }),
}));

// Export types
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Color = typeof colors.$inferSelect;
export type NewColor = typeof colors.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
