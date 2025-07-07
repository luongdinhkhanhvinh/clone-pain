"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ error: 'Username and password are required' });
            return;
        }
        const user = await db_1.db.select().from(db_1.adminUsers)
            .where((0, drizzle_orm_1.eq)(db_1.adminUsers.username, username))
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
        const isValidPassword = await bcryptjs_1.default.compare(password, foundUser.passwordHash);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        await db_1.db.update(db_1.adminUsers)
            .set({ lastLogin: new Date() })
            .where((0, drizzle_orm_1.eq)(db_1.adminUsers.id, foundUser.id));
        const token = jsonwebtoken_1.default.sign({
            userId: foundUser.id,
            username: foundUser.username,
            role: foundUser.role,
        }, process.env.JWT_SECRET, { expiresIn: '24h' });
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
        return;
    }
});
router.get('/me', auth_1.authenticateToken, async (req, res) => {
    try {
        const user = await db_1.db.select({
            id: db_1.adminUsers.id,
            username: db_1.adminUsers.username,
            email: db_1.adminUsers.email,
            firstName: db_1.adminUsers.firstName,
            lastName: db_1.adminUsers.lastName,
            role: db_1.adminUsers.role,
            lastLogin: db_1.adminUsers.lastLogin,
        }).from(db_1.adminUsers)
            .where((0, drizzle_orm_1.eq)(db_1.adminUsers.id, req.user.id))
            .limit(1);
        if (!user.length) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(user[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get user' });
        return;
    }
});
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, role } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({ error: 'Username, email, and password are required' });
            return;
        }
        const existingUsers = await db_1.db.select().from(db_1.adminUsers).limit(1);
        if (existingUsers.length > 0) {
            res.status(403).json({ error: 'Registration is disabled' });
            return;
        }
        const saltRounds = 12;
        const passwordHash = await bcryptjs_1.default.hash(password, saltRounds);
        const newUser = await db_1.db.insert(db_1.adminUsers).values({
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
    }
    catch (error) {
        console.error('Registration error:', error);
        if (error.code === '23505') {
            res.status(400).json({ error: 'Username or email already exists' });
        }
        else {
            res.status(500).json({ error: 'Registration failed' });
        }
    }
});
router.post('/change-password', auth_1.authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({ error: 'Current password and new password are required' });
            return;
        }
        const user = await db_1.db.select().from(db_1.adminUsers)
            .where((0, drizzle_orm_1.eq)(db_1.adminUsers.id, req.user.id))
            .limit(1);
        if (!user.length) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const isValidPassword = await bcryptjs_1.default.compare(currentPassword, user[0].passwordHash);
        if (!isValidPassword) {
            res.status(400).json({ error: 'Current password is incorrect' });
            return;
        }
        const saltRounds = 12;
        const newPasswordHash = await bcryptjs_1.default.hash(newPassword, saltRounds);
        await db_1.db.update(db_1.adminUsers)
            .set({
            passwordHash: newPasswordHash,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(db_1.adminUsers.id, req.user.id));
        res.json({ message: 'Password changed successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to change password' });
        return;
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map