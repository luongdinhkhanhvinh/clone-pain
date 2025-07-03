import { woodPanelColors } from './wood-panel-colors'

export interface GeneratedProduct {
  id: number
  name: string
  category: string
  type: string
  rating: number
  reviews: number
  image: string
  features: string[]
  colors: number
  coverage: string
  description: string
  baseColor: {
    id: number
    code: string
    name: string
    description: string
    hex: string
    image: string
    orderPercentage: string
  }
  availableColors: Array<{
    id: number
    code: string
    name: string
    hex: string
    image: string
  }>
  specifications: {
    thickness: string
    width: string
    length: string
    material: string
    finish: string
    installation: string
  }
}

// Generate products based on popular colors and categories
export const generateProductsFromColors = (): GeneratedProduct[] => {
  const popularColors = woodPanelColors.filter(color => color.popular)
  const products: GeneratedProduct[] = []

  // Product templates based on color categories and popularity
  const productTemplates = [
    {
      nameTemplate: "SilkLux Premium {colorName} Collection",
      category: "Interior Wood Panel",
      type: "Ultra Premium",
      features: ["Chống ẩm", "Không VOC", "Dễ lau chùi", "Chống trầy xước"],
      coverage: "20 m²",
      specifications: {
        thickness: "12mm",
        width: "200mm",
        length: "2400mm",
        material: "MDF + Veneer tự nhiên",
        finish: "UV Coating",
        installation: "Hệ thống click lock"
      }
    },
    {
      nameTemplate: "SilkLux Exterior {colorName} Pro",
      category: "Exterior Wood Panel",
      type: "Weather Resistant",
      features: ["Chống thời tiết", "Chống UV", "Chống mối mọt", "Bảo hành 10 năm"],
      coverage: "18 m²",
      specifications: {
        thickness: "15mm",
        width: "150mm",
        length: "3000mm",
        material: "Composite + Wood fiber",
        finish: "Weather Shield Coating",
        installation: "Ốc vít chuyên dụng"
      }
    },
    {
      nameTemplate: "SilkLux Luxury {colorName} Veneer",
      category: "Luxury Wood Panel",
      type: "Natural Veneer",
      features: ["Veneer tự nhiên", "Vân gỗ thật", "Hoàn thiện thủ công", "Limited Edition"],
      coverage: "15 m²",
      specifications: {
        thickness: "18mm",
        width: "180mm",
        length: "2200mm",
        material: "Plywood + Natural Veneer",
        finish: "Hand-crafted Oil Finish",
        installation: "Chuyên gia lắp đặt"
      }
    }
  ]

  let productId = 1

  // Generate products for popular colors
  popularColors.forEach((color, colorIndex) => {
    productTemplates.forEach((template, templateIndex) => {
      // Get related colors from same category for available colors
      const relatedColors = woodPanelColors
        .filter(c => c.category === color.category)
        .slice(0, 8) // Max 8 colors per product

      const product: GeneratedProduct = {
        id: productId++,
        name: template.nameTemplate.replace('{colorName}', color.name),
        category: template.category,
        type: template.type,
        rating: 4.5 + (Math.random() * 0.4), // 4.5-4.9 rating
        reviews: Math.floor(Math.random() * 200) + 50, // 50-250 reviews
        image: "/placeholder.svg",
        features: template.features,
        colors: relatedColors.length,
        coverage: template.coverage,
        description: `Ván gỗ ${color.description.toLowerCase()} cao cấp với ${color.introduction.toLowerCase()}`,
        baseColor: {
          id: color.id,
          code: color.code,
          name: color.name,
          description: color.description,
          hex: color.hex,
          image: color.image,
          orderPercentage: color.orderPercentage
        },
        availableColors: relatedColors.map(c => ({
          id: c.id,
          code: c.code,
          name: c.name,
          hex: c.hex,
          image: c.image
        })),
        specifications: template.specifications
      }

      products.push(product)
    })
  })

  // Generate some category-based products
  const categories = [...new Set(woodPanelColors.map(c => c.category))]
  
  categories.forEach(category => {
    const categoryColors = woodPanelColors.filter(c => c.category === category)
    if (categoryColors.length >= 3) {
      const product: GeneratedProduct = {
        id: productId++,
        name: `SilkLux ${category} Collection`,
        category: "Collection Wood Panel",
        type: "Multi-Color",
        rating: 4.6 + (Math.random() * 0.3),
        reviews: Math.floor(Math.random() * 150) + 30,
        image: "/placeholder.svg",
        features: ["Đa màu sắc", "Phối hợp hoàn hảo", "Thiết kế linh hoạt", "Chất lượng đồng nhất"],
        colors: categoryColors.length,
        coverage: "25 m²",
        description: `Bộ sưu tập ván gỗ ${category.toLowerCase()} với ${categoryColors.length} màu sắc phối hợp hoàn hảo.`,
        baseColor: categoryColors[0],
        availableColors: categoryColors.map(c => ({
          id: c.id,
          code: c.code,
          name: c.name,
          hex: c.hex,
          image: c.image
        })),
        specifications: {
          thickness: "12-18mm",
          width: "150-200mm",
          length: "2000-3000mm",
          material: "Mixed Premium Materials",
          finish: "Multi-finish Options",
          installation: "Flexible Installation"
        }
      }

      products.push(product)
    }
  })

  return products
}

// Generate the products
export const generatedProducts = generateProductsFromColors()

// Export categories and types based on generated products
export const generatedProductCategories = [
  "All Products",
  ...new Set(generatedProducts.map(p => p.category))
]

export const generatedProductTypes = [
  "All Types", 
  ...new Set(generatedProducts.map(p => p.type))
]
