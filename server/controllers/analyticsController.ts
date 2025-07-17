import { desc, eq, sql } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { db } from '../db';
import { pageViews, sampleRequests } from '../db/schema/analytics';
import { colors } from '../db/schema/colors';
import { contacts } from '../db/schema/contacts';
import { catchAsync } from '../middleware/error';

// @desc    Get analytics data
// @route   GET /api/analytics
// @access  Private/Admin
export const getAnalytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Get overview stats
  const [overview] = await db.select({
    totalVisitors: sql<number>`COUNT(DISTINCT ${pageViews.visitorId})`,
    totalPageViews: sql<number>`COUNT(*)`,
    totalContacts: sql<number>`(SELECT COUNT(*) FROM ${contacts})`,
    totalSamples: sql<number>`(SELECT COUNT(*) FROM ${sampleRequests})`,
    visitorGrowth: sql<number>`
      ROUND(
        ((COUNT(DISTINCT CASE WHEN ${pageViews.createdAt} >= NOW() - INTERVAL '1 month' THEN ${pageViews.visitorId} END)::float / 
          NULLIF(COUNT(DISTINCT CASE WHEN ${pageViews.createdAt} >= NOW() - INTERVAL '2 month' AND ${pageViews.createdAt} < NOW() - INTERVAL '1 month' THEN ${pageViews.visitorId} END), 0)) - 1) * 100,
        1
      )
    `,
    contactGrowth: sql<number>`
      ROUND(
        ((COUNT(DISTINCT CASE WHEN ${contacts.createdAt} >= NOW() - INTERVAL '1 month' THEN ${contacts.id} END)::float / 
          NULLIF(COUNT(DISTINCT CASE WHEN ${contacts.createdAt} >= NOW() - INTERVAL '2 month' AND ${contacts.createdAt} < NOW() - INTERVAL '1 month' THEN ${contacts.id} END), 0)) - 1) * 100,
        1
      )
    `
  })
  .from(pageViews);

  // Get popular colors
  const popularColors = await db.select({
    id: colors.id,
    name: colors.name,
    nameVi: colors.nameVi,
    views: sql<number>`COUNT(${pageViews.id})`,
    samples: sql<number>`COUNT(DISTINCT ${sampleRequests.id})`
  })
  .from(colors)
  .leftJoin(pageViews, eq(pageViews.colorId, colors.id))
  .leftJoin(sampleRequests, eq(sampleRequests.colorId, colors.id))
  .groupBy(colors.id, colors.name, colors.nameVi)
  .orderBy(desc(sql<number>`COUNT(${pageViews.id})`))
  .limit(5);

  // Get traffic sources
  const trafficSources = await db.select({
    source: pageViews.source,
    visitors: sql<number>`COUNT(DISTINCT ${pageViews.visitorId})`,
    percentage: sql<number>`ROUND(COUNT(DISTINCT ${pageViews.visitorId})::float / SUM(COUNT(DISTINCT ${pageViews.visitorId})) OVER() * 100, 1)`
  })
  .from(pageViews)
  .groupBy(pageViews.source)
  .orderBy(desc(sql<number>`COUNT(DISTINCT ${pageViews.visitorId})`))
  .limit(5);

  // Get monthly stats
  const monthlyStats = await db.select({
    month: sql<string>`TO_CHAR(date_trunc('month', ${pageViews.createdAt}), 'Mon')`,
    visitors: sql<number>`COUNT(DISTINCT ${pageViews.visitorId})`,
    contacts: sql<number>`COUNT(DISTINCT CASE WHEN ${contacts.type} = 'contact' THEN ${contacts.id} END)`,
    samples: sql<number>`COUNT(DISTINCT ${sampleRequests.id})`
  })
  .from(pageViews)
  .leftJoin(contacts, sql`date_trunc('month', ${contacts.createdAt}) = date_trunc('month', ${pageViews.createdAt})`)
  .leftJoin(sampleRequests, sql`date_trunc('month', ${sampleRequests.createdAt}) = date_trunc('month', ${pageViews.createdAt})`)
  .groupBy(sql`date_trunc('month', ${pageViews.createdAt})`)
  .orderBy(desc(sql`date_trunc('month', ${pageViews.createdAt})`))
  .limit(5);

  res.status(200).json({
    success: true,
    data: {
      overview,
      popularColors,
      trafficSources,
      monthlyStats: monthlyStats.reverse() // Send in ascending order
    }
  });
});
