import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { trendingColors } from '@/server/db/schema/woodIdeas';

export async function GET() {
  const data = await db.select().from(trendingColors);
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [data] = await db.insert(trendingColors).values(body).returning();
  return NextResponse.json({ success: true, data }, { status: 201 });
} 