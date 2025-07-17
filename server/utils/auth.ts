import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { ApiError } from '../middleware/error';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { id: string };
};

export const protect = async (req: any, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Get token from cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new ApiError(401, 'Not authorized to access this route'));
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user from the token
    const [user] = await db.select().from(users).where(eq(users.id, decoded.id));

    if (!user) {
      return next(new ApiError(401, 'User not found'));
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Not authorized'));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `User role ${req.user.role} is not authorized to access this route`)
      );
    }
    next();
  };
};

// Set token cookie
export const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
  // Create token
  const token = generateToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + (parseInt(JWT_EXPIRES_IN as string) || 7 * 24 * 60 * 60 * 1000)
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  };

  // Remove password from output
  const { passwordHash, ...userWithoutPassword } = user;

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    token,
    data: userWithoutPassword,
  });
};
