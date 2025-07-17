import { eq } from 'drizzle-orm';
import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { contacts } from '../db/schema/contacts';
import { ApiError, catchAsync } from '../middleware/error';

// GET /api/contacts
export const getAllContacts = catchAsync(async (req: Request, res: Response) => {
  const allContacts = await db.select().from(contacts);
  res.status(200).json({ success: true, data: allContacts });
});

// GET /api/contacts/:id
export const getContactById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
  if (!contact) return next(new ApiError(404, 'Contact not found'));
  res.status(200).json({ success: true, data: contact });
});

// POST /api/contacts
export const createContact = catchAsync(async (req: Request, res: Response) => {
  const { name, email, phone, companyName, message, type, status } = req.body;
  const [newContact] = await db.insert(contacts).values({
    name,
    email,
    phone,
    companyName,
    message,
    type,
    status,
  }).returning();
  res.status(201).json({ success: true, data: newContact });
});

// PUT /api/contacts/:id
export const updateContact = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
  if (!contact) return next(new ApiError(404, 'Contact not found'));
  const { name, email, phone, companyName, message, type, status } = req.body;
  const [updatedContact] = await db.update(contacts).set({
    name,
    email,
    phone,
    companyName,
    message,
    type,
    status,
    updatedAt: new Date(),
  }).where(eq(contacts.id, id)).returning();
  res.status(200).json({ success: true, data: updatedContact });
});

// DELETE /api/contacts/:id
export const deleteContact = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
  if (!contact) return next(new ApiError(404, 'Contact not found'));
  await db.delete(contacts).where(eq(contacts.id, id));
  res.status(204).send();
}); 