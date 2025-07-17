import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { users } from '../db/schema';
import { ApiError, catchAsync } from '../middleware/error';
import { sendTokenResponse } from '../utils/auth';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, fullName } = req.body;

  // Check if user already exists
  const [existingUser] = await db.select().from(users).where(eq(users.email, email));
  
  if (existingUser) {
    return next(new ApiError(400, 'User already exists with this email'));
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const [newUser] = await db.insert(users).values({
    id: uuidv4(),
    email,
    passwordHash: hashedPassword,
    fullName,
    role: 'user',
    emailVerified: false,
  }).returning();

  // Remove password from output
  const { passwordHash, ...userWithoutPassword } = newUser;

  // Send token response
  sendTokenResponse(newUser, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Check if user exists
  const [user] = await db.select().from(users).where(eq(users.email, email));
  
  if (!user) {
    return next(new ApiError(401, 'Invalid credentials'));
  }

  // Check if password is correct
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return next(new ApiError(401, 'Invalid credentials'));
  }

  // Send token response
  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const [user] = await db.select().from(users).where(eq(users.id, req.user.id));
  
  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  // Remove password from output
  const { passwordHash, ...userWithoutPassword } = user;

  res.status(200).json({
    success: true,
    data: userWithoutPassword,
  });
});

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
export const updateDetails = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const fieldsToUpdate = {
    fullName: req.body.fullName,
    email: req.body.email,
  };

  const [updatedUser] = await db
    .update(users)
    .set(fieldsToUpdate)
    .where(eq(users.id, req.user.id))
    .returning();

  // Remove password from output
  const { passwordHash, ...userWithoutPassword } = updatedUser;

  res.status(200).json({
    success: true,
    data: userWithoutPassword,
  });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const [user] = await db.select().from(users).where(eq(users.id, req.user.id));
  
  // Check current password
  if (!(await bcrypt.compare(req.body.currentPassword, user.passwordHash))) {
    return next(new ApiError(401, 'Current password is incorrect'));
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

  // Update password
  await db
    .update(users)
    .set({ passwordHash: hashedPassword })
    .where(eq(users.id, req.user.id));

  sendTokenResponse(user, 200, res);
});
