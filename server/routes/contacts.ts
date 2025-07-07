import express from 'express';
import { db, contacts } from '../db';
import { eq, desc, like, and, or, count } from 'drizzle-orm';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Get all contacts with pagination and filters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const source = req.query.source as string;

    const offset = (page - 1) * limit;

    let whereConditions = [];

    if (search) {
      whereConditions.push(
        or(
          like(contacts.firstName, `%${search}%`),
          like(contacts.lastName, `%${search}%`),
          like(contacts.email, `%${search}%`),
          like(contacts.company, `%${search}%`),
          like(contacts.subject, `%${search}%`)
        )
      );
    }

    if (status) {
      whereConditions.push(eq(contacts.status, status));
    }

    if (source) {
      whereConditions.push(eq(contacts.source, source));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const contactsList = await db
      .select()
      .from(contacts)
      .where(whereClause)
      .orderBy(desc(contacts.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalResult = await db
      .select({ count: count() })
      .from(contacts)
      .where(whereClause);

    const total = totalResult[0].count;
    const totalPages = Math.ceil(total / limit);

    // Get status counts for dashboard
    const statusCounts = await db
      .select({
        status: contacts.status,
        count: count(),
      })
      .from(contacts)
      .groupBy(contacts.status);

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
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
    return;
  }
});

// Get contact by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const contactId = parseInt(req.params.id);
    const contact = await db.select().from(contacts)
      .where(eq(contacts.id, contactId))
      .limit(1);

    if (!contact.length) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    res.json(contact[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch contact' });
    return;
  }
});

// Create new contact (public endpoint for form submissions)
router.post('/', async (req, res): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      subject,
      message,
      source,
      metadata,
    } = req.body;

    if (!firstName || !lastName || !email || !message) {
      res.status(400).json({ error: 'First name, last name, email, and message are required' });
      return;
    }

    const newContact = await db.insert(contacts).values({
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
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create contact' });
    return;
  }
});

// Update contact status and notes
router.put('/:id', authenticateToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const contactId = parseInt(req.params.id);
    const { status, assignedTo, notes } = req.body;

    const updatedContact = await db.update(contacts)
      .set({
        status,
        assignedTo,
        notes,
        updatedAt: new Date(),
      })
      .where(eq(contacts.id, contactId))
      .returning();

    if (!updatedContact.length) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    res.json(updatedContact[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update contact' });
    return;
  }
});

// Delete contact
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const contactId = parseInt(req.params.id);

    const deletedContact = await db.delete(contacts)
      .where(eq(contacts.id, contactId))
      .returning();

    if (!deletedContact.length) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete contact' });
    return;
  }
});

// Get contact statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const totalContacts = await db.select({ count: count() }).from(contacts);
    
    const statusCounts = await db
      .select({
        status: contacts.status,
        count: count(),
      })
      .from(contacts)
      .groupBy(contacts.status);

    const sourceCounts = await db
      .select({
        source: contacts.source,
        count: count(),
      })
      .from(contacts)
      .groupBy(contacts.source);

    // Recent contacts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentContacts = await db
      .select({ count: count() })
      .from(contacts)
      .where(eq(contacts.createdAt, sevenDaysAgo));

    res.json({
      total: totalContacts[0].count,
      recent: recentContacts[0].count,
      byStatus: statusCounts,
      bySource: sourceCounts,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch contact statistics' });
    return;
  }
});

export default router;
