-- Seed wood_ideas
INSERT INTO wood_ideas (id, name, description, image, room, style, likes, saves, created_at, updated_at) VALUES
  (gen_random_uuid(), 'Serene Sanctuary', 'Calming blues and soft whites create a peaceful retreat', '/placeholder.svg?height=300&width=400', 'Bedroom', 'Modern', 245, 89, NOW(), NOW()),
  (gen_random_uuid(), 'Warm Earth Tones', 'Rich terracotta and warm beiges for a cozy atmosphere', '/placeholder.svg?height=300&width=400', 'Living Room', 'Traditional', 312, 156, NOW(), NOW()),
  (gen_random_uuid(), 'Fresh Kitchen Greens', 'Sage and mint greens with crisp white accents', '/placeholder.svg?height=300&width=400', 'Kitchen', 'Farmhouse', 189, 203, NOW(), NOW()),
  (gen_random_uuid(), 'Bold Statement Wall', 'Deep navy creates drama with gold accents', '/placeholder.svg?height=300&width=400', 'Dining Room', 'Modern', 278, 134, NOW(), NOW()),
  (gen_random_uuid(), 'Spa-Like Bathroom', 'Soft grays and whites for a clean, relaxing feel', '/placeholder.svg?height=300&width=400', 'Bathroom', 'Minimalist', 156, 98, NOW(), NOW()),
  (gen_random_uuid(), 'Cozy Home Office', 'Warm grays with pops of energizing orange', '/placeholder.svg?height=300&width=400', 'Home Office', 'Industrial', 134, 67, NOW(), NOW());

-- Seed color_schemes
INSERT INTO color_schemes (id, name, description, colors, room, style, image, likes, saves, created_at, updated_at) VALUES
  (gen_random_uuid(), 'Serene Sanctuary', 'Calming blues and soft whites create a peaceful retreat', '["#E8F4F8", "#B8D4E3", "#7FB3D3", "#4A90A4"]', 'Bedroom', 'Modern', '/placeholder.svg?height=300&width=400', 245, 89, NOW(), NOW()),
  (gen_random_uuid(), 'Warm Earth Tones', 'Rich terracotta and warm beiges for a cozy atmosphere', '["#F5E6D3", "#E8C5A0", "#D4A574", "#B8956A"]', 'Living Room', 'Traditional', '/placeholder.svg?height=300&width=400', 312, 156, NOW(), NOW()),
  (gen_random_uuid(), 'Fresh Kitchen Greens', 'Sage and mint greens with crisp white accents', '["#FFFFFF", "#F0F4F0", "#C8D5C8", "#87A96B"]', 'Kitchen', 'Farmhouse', '/placeholder.svg?height=300&width=400', 189, 203, NOW(), NOW()),
  (gen_random_uuid(), 'Bold Statement Wall', 'Deep navy creates drama with gold accents', '["#F8F6F0", "#D4AF37", "#2C3E50", "#1B2951"]', 'Dining Room', 'Modern', '/placeholder.svg?height=300&width=400', 278, 134, NOW(), NOW()),
  (gen_random_uuid(), 'Spa-Like Bathroom', 'Soft grays and whites for a clean, relaxing feel', '["#FFFFFF", "#F5F5F5", "#D3D3D3", "#9B9B9B"]', 'Bathroom', 'Minimalist', '/placeholder.svg?height=300&width=400', 156, 98, NOW(), NOW()),
  (gen_random_uuid(), 'Cozy Home Office', 'Warm grays with pops of energizing orange', '["#F7F4F2", "#E5DDD5", "#D4A574", "#FF8C42"]', 'Home Office', 'Industrial', '/placeholder.svg?height=300&width=400', 134, 67, NOW(), NOW());

-- Seed trending_colors
INSERT INTO trending_colors (id, name, code, hex, trend, description, image, created_at, updated_at) VALUES
  (gen_random_uuid(), 'Aegean Teal', '2136-40', '#4A90A4', 'Ocean Inspired', NULL, NULL, NOW(), NOW()),
  (gen_random_uuid(), 'October Mist', '1495', '#C5B8A5', 'Warm Neutrals', NULL, NULL, NOW(), NOW()),
  (gen_random_uuid(), 'Forest Green', '2047-10', '#355E3B', 'Nature''s Palette', NULL, NULL, NOW(), NOW()),
  (gen_random_uuid(), 'Raspberry Blush', '2008-30', '#D4A5A5', 'Soft Romance', NULL, NULL, NOW(), NOW());

-- Seed tips
INSERT INTO tips (id, title, description, image, created_at, updated_at) VALUES
  (gen_random_uuid(), '60-30-10 Rule', 'Use 60% dominant color, 30% secondary, 10% accent for balanced rooms.', '/placeholder.svg?height=200&width=300', NOW(), NOW()),
  (gen_random_uuid(), 'Test Colors First', 'Always test paint colors in your space before committing.', '/placeholder.svg?height=200&width=300', NOW(), NOW()),
  (gen_random_uuid(), 'Consider Function', 'Choose colors based on the room''s function and lighting.', '/placeholder.svg?height=200&width=300', NOW(), NOW()); 