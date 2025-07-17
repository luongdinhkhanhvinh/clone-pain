import { eq } from 'drizzle-orm';
import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { ApiError, catchAsync } from '../middleware/error';
import bcrypt from 'bcryptjs';

// GET /api/users
export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const allUsers = await db.select().from(users);
  res.status(200).json({ success: true, data: allUsers });
});

// GET /api/users/:id
export const getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const [user] = await db.select().from(users).where(eq(users.id, id));
  if (!user) return next(new ApiError(404, 'User not found'));
  res.status(200).json({ success: true, data: user });
});

// POST /api/users
export const createUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password, fullName, role, isActive } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const [newUser] = await db.insert(users).values({
    email,
    passwordHash,
    fullName,
    role,
    emailVerified: false,
    avatarUrl: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();
  res.status(201).json({ success: true, data: newUser });
});

// PUT /api/users/:id
export const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { email, fullName, role, isActive, password } = req.body;
  const [user] = await db.select().from(users).where(eq(users.id, id));
  if (!user) return next(new ApiError(404, 'User not found'));
  let updateData: any = { email, fullName, role, updatedAt: new Date() };
  if (typeof isActive === 'boolean') updateData.isActive = isActive;
  if (password) updateData.passwordHash = await bcrypt.hash(password, 10);
  const [updatedUser] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
  res.status(200).json({ success: true, data: updatedUser });
});

// DELETE /api/users/:id
export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const [user] = await db.select().from(users).where(eq(users.id, id));
  if (!user) return next(new ApiError(404, 'User not found'));
  await db.delete(users).where(eq(users.id, id));
  res.status(204).send();
}); 