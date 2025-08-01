import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { woodIdeas } from '@/server/db/schema/woodIdeas';

export async function GET() {
  const data = await db.select().from(woodIdeas);
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [data] = await db.insert(woodIdeas).values(body).returning();
  return NextResponse.json({ success: true, data }, { status: 201 });
} 