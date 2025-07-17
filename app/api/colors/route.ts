import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { colors } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Color } from '@/lib/api';

export async function GET() {
  try {
    const popularColors = await db.query.colors.findMany({
      where: eq(colors.isPopular, true),
      limit: 6,
    });

    return NextResponse.json({
      success: true,
      data: {
        colors: popularColors.map((color): Color => ({
          id: color.id,
          name: color.name,
          code: color.code,
          imageUrl: color.imageUrl || '',
          isPopular: Boolean(color.isPopular), // Ensure boolean
          description: color.description || undefined,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching popular colors:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch colors' },
      { status: 500 }
    );
  }
}
