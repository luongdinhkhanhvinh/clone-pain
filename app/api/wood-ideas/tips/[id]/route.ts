import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { tips } from '@/server/db/schema/woodIdeas';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await db.select().from(tips).where(eq(tips.id, id));
  return NextResponse.json({ success: true, data: data[0] });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  const [data] = await db.update(tips).set(body).where(eq(tips.id, id)).returning();
  return NextResponse.json({ success: true, data });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  await db.delete(tips).where(eq(tips.id, id));
  return NextResponse.json({ success: true });
} 