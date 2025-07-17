import { db } from './index';
import { sql } from 'drizzle-orm';

export async function initializeDatabase() {
  try {
    // Create colors table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS colors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        code VARCHAR(20) NOT NULL,
        image_url TEXT,
        description TEXT,
        is_popular BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Check if we have any colors
    const result = await db.execute<{ count: string }>(sql`SELECT COUNT(*) as count FROM colors`);
    const count = parseInt(result.rows[0]?.count || '0', 10);

    // Insert sample colors if the table is empty
    if (count === 0) {
      await db.execute(sql`
        INSERT INTO colors (name, code, image_url, description, is_popular) VALUES
          ('Warm Grey', '#8B8680', '/colors/WarmGrey.png', 'Elegant neutral tone', true),
          ('Midnight Blue', '#191970', '/colors/MidnightBlue.png', 'Deep blue shade', true),
          ('Sage Green', '#9CAF88', '/colors/SageGreen.png', 'Muted green tone', true),
          ('Taupe', '#B38B6D', '/colors/Taupe.png', 'Warm neutral', false),
          ('Navy', '#000080', '/colors/Navy.png', 'Classic dark blue', true),
          ('Slate', '#708090', '/colors/Slate.png', 'Cool gray with blue undertones', true);
      `);
      
      console.log('Added sample colors to the database');
    }

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
