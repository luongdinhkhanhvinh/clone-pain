import { db, adminUsers, categories, colors, products, articles, contacts } from './index';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.delete(contacts);
    await db.delete(articles);
    await db.delete(products);
    await db.delete(colors);
    await db.delete(categories);
    await db.delete(adminUsers);

    // Seed Admin Users
    console.log('👤 Seeding admin users...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await db.insert(adminUsers).values([
      {
        username: 'admin',
        email: 'admin@woodpanel.com',
        passwordHash: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
      },
      {
        username: 'manager',
        email: 'manager@woodpanel.com',
        passwordHash: await bcrypt.hash('manager123', 10),
        firstName: 'Manager',
        lastName: 'User',
        role: 'manager',
        isActive: true,
      }
    ]);

    // Seed Categories
    console.log('📂 Seeding categories...');
    const categoryData = await db.insert(categories).values([
      {
        name: 'Premium Wood Panels',
        nameVi: 'Ván Gỗ Cao Cấp',
        slug: 'premium-wood-panels',
        description: 'High-quality premium wood panels for luxury applications',
        descriptionVi: 'Ván gỗ cao cấp chất lượng cao cho các ứng dụng sang trọng',
        isActive: true,
        sortOrder: 1,
      },
      {
        name: 'Standard Wood Panels',
        nameVi: 'Ván Gỗ Tiêu Chuẩn',
        slug: 'standard-wood-panels',
        description: 'Reliable standard wood panels for everyday use',
        descriptionVi: 'Ván gỗ tiêu chuẩn đáng tin cậy cho sử dụng hàng ngày',
        isActive: true,
        sortOrder: 2,
      },
      {
        name: 'Specialty Finishes',
        nameVi: 'Hoàn Thiện Đặc Biệt',
        slug: 'specialty-finishes',
        description: 'Unique specialty finishes and textures',
        descriptionVi: 'Hoàn thiện và kết cấu đặc biệt độc đáo',
        isActive: true,
        sortOrder: 3,
      }
    ]).returning();

    // Seed Colors
    console.log('🎨 Seeding colors...');
    await db.insert(colors).values([
      {
        name: 'Jet Black',
        nameVi: 'Đen Tuyền',
        code: 'JB-001',
        hexColor: '#1a1a1a',
        imageUrl: '/colors/JetBlack.png',
        description: 'Deep, rich black with sophisticated elegance',
        descriptionVi: 'Màu đen sâu, phong phú với vẻ thanh lịch tinh tế',
        categoryId: categoryData[0].id,
        popularity: 85,
        isActive: true,
      },
      {
        name: 'Summer White',
        nameVi: 'Trắng Mùa Hè',
        code: 'SW-002',
        hexColor: '#f8f8f8',
        imageUrl: '/colors/SummerWhite.png',
        description: 'Clean, bright white perfect for modern spaces',
        descriptionVi: 'Màu trắng sạch, sáng hoàn hảo cho không gian hiện đại',
        categoryId: categoryData[0].id,
        popularity: 90,
        isActive: true,
      },
      {
        name: 'Chocolate',
        nameVi: 'Sô-cô-la',
        code: 'CH-003',
        hexColor: '#7b3f00',
        imageUrl: '/colors/Chocolate.png',
        description: 'Rich chocolate brown for warm, cozy environments',
        descriptionVi: 'Màu nâu sô-cô-la đậm đà cho môi trường ấm áp, ấm cúng',
        categoryId: categoryData[1].id,
        popularity: 70,
        isActive: true,
      },
      {
        name: 'Jungle Green',
        nameVi: 'Xanh Rừng',
        code: 'JG-004',
        hexColor: '#355e3b',
        imageUrl: '/colors/JungleGreen.png',
        description: 'Deep forest green bringing nature indoors',
        descriptionVi: 'Màu xanh rừng sâu mang thiên nhiên vào trong nhà',
        categoryId: categoryData[1].id,
        popularity: 65,
        isActive: true,
      },
      {
        name: 'Warm Grey',
        nameVi: 'Xám Ấm',
        code: 'WG-005',
        hexColor: '#8b8680',
        imageUrl: '/colors/WarmGrey.png',
        description: 'Sophisticated warm grey for contemporary design',
        descriptionVi: 'Màu xám ấm tinh tế cho thiết kế đương đại',
        categoryId: categoryData[0].id,
        popularity: 80,
        isActive: true,
      },
      {
        name: 'Oat Meal',
        nameVi: 'Yến Mạch',
        code: 'OM-006',
        hexColor: '#ddd6c1',
        imageUrl: '/colors/OatMeal.png',
        description: 'Soft, neutral beige perfect for any room',
        descriptionVi: 'Màu be trung tính mềm mại hoàn hảo cho mọi phòng',
        categoryId: categoryData[1].id,
        popularity: 75,
        isActive: true,
      }
    ]);

    console.log('✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('🎉 Seeding finished!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export default seed;
