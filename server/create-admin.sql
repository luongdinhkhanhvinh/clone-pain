-- Create admin user directly in database
-- Password: admin123 (hashed with bcrypt)

INSERT INTO admin_users (
  username, 
  email, 
  password_hash, 
  first_name, 
  last_name, 
  role, 
  is_active,
  created_at,
  updated_at
) VALUES (
  'admin',
  'admin@woodpanel.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: admin123
  'Admin',
  'User',
  'admin',
  true,
  NOW(),
  NOW()
) ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- Create some basic categories
INSERT INTO categories (
  name,
  name_vi,
  slug,
  description,
  description_vi,
  is_active,
  sort_order,
  created_at,
  updated_at
) VALUES 
(
  'Premium Silkluxs',
  'Ván Gỗ Cao Cấp',
  'premium-wood-panels',
  'High-quality premium Silkluxs',
  'Ván gỗ cao cấp chất lượng cao',
  true,
  1,
  NOW(),
  NOW()
),
(
  'Standard Silkluxs',
  'Ván Gỗ Tiêu Chuẩn',
  'standard-wood-panels',
  'Standard quality Silkluxs',
  'Ván gỗ chất lượng tiêu chuẩn',
  true,
  2,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Create some basic colors
INSERT INTO colors (
  name,
  name_vi,
  code,
  hex_color,
  image_url,
  description,
  description_vi,
  category_id,
  popularity,
  is_active,
  created_at,
  updated_at
) VALUES 
(
  'Jet Black',
  'Đen Tuyền',
  'JB-001',
  '#1a1a1a',
  '/colors/JetBlack.png',
  'Deep, rich black with sophisticated elegance',
  'Màu đen sâu, phong phú với vẻ thanh lịch tinh tế',
  1,
  85,
  true,
  NOW(),
  NOW()
),
(
  'Summer White',
  'Trắng Mùa Hè',
  'SW-002',
  '#f8f8f8',
  '/colors/SummerWhite.png',
  'Clean, bright white perfect for modern spaces',
  'Màu trắng sạch, sáng hoàn hảo cho không gian hiện đại',
  1,
  90,
  true,
  NOW(),
  NOW()
),
(
  'Chocolate',
  'Sô-cô-la',
  'CH-003',
  '#7b3f00',
  '/colors/Chocolate.png',
  'Rich chocolate brown for warm, cozy environments',
  'Màu nâu sô-cô-la đậm đà cho môi trường ấm áp, ấm cúng',
  2,
  70,
  true,
  NOW(),
  NOW()
) ON CONFLICT (code) DO NOTHING;
