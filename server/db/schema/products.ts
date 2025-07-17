import { pgTable, uuid, varchar, text, timestamp, numeric, boolean } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  sku: varchar('sku', { length: 100 }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: numeric('price').notNull(),
  compareAtPrice: numeric('compare_at_price'),
  costPerItem: numeric('cost_per_item'),
  status: varchar('status', { length: 20 }).default('draft').notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isBestseller: boolean('is_bestseller').default(false).notNull(),
  isNew: boolean('is_new').default(false).notNull(),
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
