import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const colors = pgTable('colors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  nameVi: varchar('name_vi', { length: 255 }).notNull(),
  description: text('description'),
  descriptionVi: text('description_vi'),
  hexCode: varchar('hex_code', { length: 7 }).notNull(),
  status: varchar('status', { length: 20 }).default('draft').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
