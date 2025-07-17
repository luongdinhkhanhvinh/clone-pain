import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { tips } from '@/server/db/schema/woodIdeas';

export async function GET() {
  const data = await db.select().from(tips);
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [data] = await db.insert(tips).values(body).returning();
  return NextResponse.json({ success: true, data }, { status: 201 });
} 