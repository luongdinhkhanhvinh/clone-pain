import { pgTable, uuid, varchar, timestamp, integer, text } from 'drizzle-orm/pg-core';
import { colors } from './colors';
import { products } from './products';

export const pageViews = pgTable('page_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  visitorId: varchar('visitor_id', { length: 255 }).notNull(),
  source: varchar('source', { length: 100 }).notNull(),
  path: varchar('path', { length: 255 }).notNull(),
  colorId: uuid('color_id').references(() => colors.id),
  productId: uuid('product_id').references(() => products.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sampleRequests = pgTable('sample_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  colorId: uuid('color_id').references(() => colors.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  message: text('message'),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
