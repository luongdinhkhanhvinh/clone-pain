import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { pageViews } from '../db/schema/analytics';
import { v4 as uuidv4 } from 'uuid';

export const trackPageView = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get visitor ID from cookie or create new one
    let visitorId = req.cookies.visitorId;
    if (!visitorId) {
      visitorId = uuidv4();
      res.cookie('visitorId', visitorId, {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
    }

    // Get referrer source
    let source = 'direct';
    const referer = req.headers.referer;
    if (referer) {
      if (referer.includes('google')) source = 'google';
      else if (referer.includes('facebook')) source = 'facebook';
      else if (referer.includes('instagram')) source = 'instagram';
      else if (referer.includes('twitter')) source = 'twitter';
      else source = 'referral';
    }

    // Get path and extract color/product IDs if present
    const path = req.path;
    let colorId = null;
    let productId = null;

    // Extract color ID from path if viewing a color
    const colorMatch = path.match(/\/colors\/([a-f0-9-]+)/i);
    if (colorMatch) {
      colorId = colorMatch[1];
    }

    // Extract product ID from path if viewing a product
    const productMatch = path.match(/\/products\/([a-f0-9-]+)/i);
    if (productMatch) {
      productId = productMatch[1];
    }

    // Record page view
    await db.insert(pageViews).values({
      id: uuidv4(),
      visitorId,
      source,
      path,
      colorId,
      productId,
    });

    next();
  } catch (error) {
    console.error('Error tracking page view:', error);
    next(); // Continue even if tracking fails
  }
};
