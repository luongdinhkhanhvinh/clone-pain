"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search;
        const status = req.query.status;
        const source = req.query.source;
        const offset = (page - 1) * limit;
        let whereConditions = [];
        if (search) {
            whereConditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(db_1.contacts.firstName, `%${search}%`), (0, drizzle_orm_1.like)(db_1.contacts.lastName, `%${search}%`), (0, drizzle_orm_1.like)(db_1.contacts.email, `%${search}%`), (0, drizzle_orm_1.like)(db_1.contacts.company, `%${search}%`), (0, drizzle_orm_1.like)(db_1.contacts.subject, `%${search}%`)));
        }
        if (status) {
            whereConditions.push((0, drizzle_orm_1.eq)(db_1.contacts.status, status));
        }
        if (source) {
            whereConditions.push((0, drizzle_orm_1.eq)(db_1.contacts.source, source));
        }
        const whereClause = whereConditions.length > 0 ? (0, drizzle_orm_1.and)(...whereConditions) : undefined;
        const contactsList = await db_1.db
            .select()
            .from(db_1.contacts)
            .where(whereClause)
            .orderBy((0, drizzle_orm_1.desc)(db_1.contacts.createdAt))
            .limit(limit)
            .offset(offset);
        const totalResult = await db_1.db
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(db_1.contacts)
            .where(whereClause);
        const total = totalResult[0].count;
        const totalPages = Math.ceil(total / limit);
        const statusCounts = await db_1.db
            .select({
            status: db_1.contacts.status,
            count: (0, drizzle_orm_1.count)(),
        })
            .from(db_1.contacts)
            .groupBy(db_1.contacts.status);
        res.json({
            data: contactsList,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
            statusCounts,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch contacts' });
        return;
    }
});
router.get('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const contactId = parseInt(req.params.id);
        const contact = await db_1.db.select().from(db_1.contacts)
            .where((0, drizzle_orm_1.eq)(db_1.contacts.id, contactId))
            .limit(1);
        if (!contact.length) {
            res.status(404).json({ error: 'Contact not found' });
            return;
        }
        res.json(contact[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch contact' });
        return;
    }
});
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, company, subject, message, source, metadata, } = req.body;
        if (!firstName || !lastName || !email || !message) {
            res.status(400).json({ error: 'First name, last name, email, and message are required' });
            return;
        }
        const newContact = await db_1.db.insert(db_1.contacts).values({
            firstName,
            lastName,
            email,
            phone,
            company,
            subject,
            message,
            source: source || 'contact_form',
            metadata,
            status: 'new',
        }).returning();
        res.status(201).json(newContact[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create contact' });
        return;
    }
});
router.put('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin', 'editor']), async (req, res) => {
    try {
        const contactId = parseInt(req.params.id);
        const { status, assignedTo, notes } = req.body;
        const updatedContact = await db_1.db.update(db_1.contacts)
            .set({
            status,
            assignedTo,
            notes,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(db_1.contacts.id, contactId))
            .returning();
        if (!updatedContact.length) {
            res.status(404).json({ error: 'Contact not found' });
            return;
        }
        res.json(updatedContact[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update contact' });
        return;
    }
});
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        const contactId = parseInt(req.params.id);
        const deletedContact = await db_1.db.delete(db_1.contacts)
            .where((0, drizzle_orm_1.eq)(db_1.contacts.id, contactId))
            .returning();
        if (!deletedContact.length) {
            res.status(404).json({ error: 'Contact not found' });
            return;
        }
        res.json({ message: 'Contact deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete contact' });
        return;
    }
});
router.get('/stats/overview', auth_1.authenticateToken, async (req, res) => {
    try {
        const totalContacts = await db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(db_1.contacts);
        const statusCounts = await db_1.db
            .select({
            status: db_1.contacts.status,
            count: (0, drizzle_orm_1.count)(),
        })
            .from(db_1.contacts)
            .groupBy(db_1.contacts.status);
        const sourceCounts = await db_1.db
            .select({
            source: db_1.contacts.source,
            count: (0, drizzle_orm_1.count)(),
        })
            .from(db_1.contacts)
            .groupBy(db_1.contacts.source);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentContacts = await db_1.db
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(db_1.contacts)
            .where((0, drizzle_orm_1.eq)(db_1.contacts.createdAt, sevenDaysAgo));
        res.json({
            total: totalContacts[0].count,
            recent: recentContacts[0].count,
            byStatus: statusCounts,
            bySource: sourceCounts,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch contact statistics' });
        return;
    }
});
exports.default = router;
//# sourceMappingURL=contacts.js.map