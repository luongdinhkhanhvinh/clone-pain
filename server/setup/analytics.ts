import express from 'express';
import { trackPageView } from '../middleware/tracking';

export const setupAnalytics = (app: express.Application) => {
  // Add tracking middleware to all routes that should be tracked
  app.use([
    '/colors/*',
    '/products/*',
    '/wood-colors/*',
    '/wood-ideas/*',
    '/professionals/*'
  ], trackPageView);
};
