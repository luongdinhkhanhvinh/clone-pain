import { db } from '../db';
import { woodIdeas, colorSchemes, trendingColors, tips } from '../db/schema/woodIdeas';
import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';

// --- WOOD IDEAS CRUD ---
export const getAllWoodIdeas = async (req: Request, res: Response) => {
  const data = await db.select().from(woodIdeas);
  res.json({ success: true, data });
};

export const getWoodIdea = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await db.select().from(woodIdeas).where(eq(woodIdeas.id, id));
  res.json({ success: true, data: data[0] });
};

export const createWoodIdea = async (req: Request, res: Response) => {
  const [data] = await db.insert(woodIdeas).values(req.body).returning();
  res.status(201).json({ success: true, data });
};

export const updateWoodIdea = async (req: Request, res: Response) => {
  const { id } = req.params;
  const [data] = await db.update(woodIdeas).set(req.body).where(eq(woodIdeas.id, id)).returning();
  res.json({ success: true, data });
};

export const deleteWoodIdea = async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.delete(woodIdeas).where(eq(woodIdeas.id, id));
  res.json({ success: true });
};

// --- COLOR SCHEMES CRUD ---
export const getAllColorSchemes = async (req: Request, res: Response) => {
  const data = await db.select().from(colorSchemes);
  res.json({ success: true, data });
};

export const getColorScheme = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await db.select().from(colorSchemes).where(eq(colorSchemes.id, id));
  res.json({ success: true, data: data[0] });
};

export const createColorScheme = async (req: Request, res: Response) => {
  const [data] = await db.insert(colorSchemes).values(req.body).returning();
  res.status(201).json({ success: true, data });
};

export const updateColorScheme = async (req: Request, res: Response) => {
  const { id } = req.params;
  const [data] = await db.update(colorSchemes).set(req.body).where(eq(colorSchemes.id, id)).returning();
  res.json({ success: true, data });
};

export const deleteColorScheme = async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.delete(colorSchemes).where(eq(colorSchemes.id, id));
  res.json({ success: true });
};

// --- TRENDING COLORS CRUD ---
export const getAllTrendingColors = async (req: Request, res: Response) => {
  const data = await db.select().from(trendingColors);
  res.json({ success: true, data });
};

export const getTrendingColor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await db.select().from(trendingColors).where(eq(trendingColors.id, id));
  res.json({ success: true, data: data[0] });
};

export const createTrendingColor = async (req: Request, res: Response) => {
  const [data] = await db.insert(trendingColors).values(req.body).returning();
  res.status(201).json({ success: true, data });
};

export const updateTrendingColor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const [data] = await db.update(trendingColors).set(req.body).where(eq(trendingColors.id, id)).returning();
  res.json({ success: true, data });
};

export const deleteTrendingColor = async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.delete(trendingColors).where(eq(trendingColors.id, id));
  res.json({ success: true });
};

// --- TIPS CRUD ---
export const getAllTips = async (req: Request, res: Response) => {
  const data = await db.select().from(tips);
  res.json({ success: true, data });
};

export const getTip = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await db.select().from(tips).where(eq(tips.id, id));
  res.json({ success: true, data: data[0] });
};

export const createTip = async (req: Request, res: Response) => {
  const [data] = await db.insert(tips).values(req.body).returning();
  res.status(201).json({ success: true, data });
};

export const updateTip = async (req: Request, res: Response) => {
  const { id } = req.params;
  const [data] = await db.update(tips).set(req.body).where(eq(tips.id, id)).returning();
  res.json({ success: true, data });
};

export const deleteTip = async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.delete(tips).where(eq(tips.id, id));
  res.json({ success: true });
}; 