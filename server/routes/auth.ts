import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, adminUsers } from '../db';
import { eq } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    // Find user by username or email
    const user = await db.select().from(adminUsers)
      .where(eq(adminUsers.username, username))
      .limit(1);

    if (!user.length) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const foundUser = user[0];

    if (!foundUser.isActive) {
      res.status(401).json({ error: 'Account is disabled' });
      return;
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, foundUser.passwordHash);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Update last login
    await db.update(adminUsers)
      .set({ lastLogin: new Date() })
      .where(eq(adminUsers.id, foundUser.id));

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        role: foundUser.role,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
    return;
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.select({
      id: adminUsers.id,
      username: adminUsers.username,
      email: adminUsers.email,
      firstName: adminUsers.firstName,
      lastName: adminUsers.lastName,
      role: adminUsers.role,
      lastLogin: adminUsers.lastLogin,
    }).from(adminUsers)
      .where(eq(adminUsers.id, req.user!.id))
      .limit(1);

    if (!user.length) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get user' });
    return;
  }
});

// Create admin user (only for initial setup)
router.post('/register', async (req, res): Promise<void> => {
  try {
    const { username, email, password, firstName, lastName, role } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: 'Username, email, and password are required' });
      return;
    }

    // Check if any admin users exist (for initial setup only)
    const existingUsers = await db.select().from(adminUsers).limit(1);
    if (existingUsers.length > 0) {
      res.status(403).json({ error: 'Registration is disabled' });
      return;
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await db.insert(adminUsers).values({
      username,
      email,
      passwordHash,
      firstName,
      lastName,
      role: role || 'admin',
    }).returning();

    res.status(201).json({
      message: 'Admin user created successfully',
      user: {
        id: newUser[0].id,
        username: newUser[0].username,
        email: newUser[0].email,
        firstName: newUser[0].firstName,
        lastName: newUser[0].lastName,
        role: newUser[0].role,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.code === '23505') {
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current password and new password are required' });
      return;
    }

    // Get current user
    const user = await db.select().from(adminUsers)
      .where(eq(adminUsers.id, req.user!.id))
      .limit(1);

    if (!user.length) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user[0].passwordHash);
    if (!isValidPassword) {
      res.status(400).json({ error: 'Current password is incorrect' });
      return;
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await db.update(adminUsers)
      .set({ 
        passwordHash: newPasswordHash,
        updatedAt: new Date(),
      })
      .where(eq(adminUsers.id, req.user!.id));

    res.json({ message: 'Password changed successfully' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to change password' });
    return;
  }
});

export default router;
