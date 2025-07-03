export interface WoodPanelProduct {
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
  specifications: {
    thickness: string
    width: string
    length: string
    material: string
    finish: string
    installation: string
  }
}

export const woodPanelProducts: WoodPanelProduct[] = [
  {
    id: 1,
    name: "SilkLux Premium Wood Panel Interior",
    category: "Interior Wood Panel",
    type: "Ultra Premium",
    rating: 4.8,
    reviews: 156,
    image: "/placeholder.svg",
    features: ["Chống ẩm", "Không VOC", "Dễ lau chùi", "Chống trầy xước"],
    colors: 15,
    coverage: "20 m²",
    description: "Ván gỗ nội thất cao cấp với lớp hoàn thiện mịn như , chống ẩm và bền màu theo thời gian.",
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
    id: 2,
    name: "SilkLux Exterior Wood Panel Pro",
    category: "Exterior Wood Panel", 
    type: "Weather Resistant",
    rating: 4.7,
    reviews: 89,
    image: "/placeholder.svg",
    features: ["Chống thời tiết", "Chống UV", "Chống mối mọt", "Bảo hành 10 năm"],
    colors: 12,
    coverage: "18 m²",
    description: "Ván gỗ ngoại thất chuyên dụng, chịu được mọi điều kiện thời tiết khắc nghiệt.",
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
    id: 3,
    name: "SilkLux Luxury Veneer Collection",
    category: "Luxury Wood Panel",
    type: "Natural Veneer",
    rating: 4.9,
    reviews: 234,
    image: "/placeholder.svg", 
    features: ["Veneer tự nhiên", "Vân gỗ thật", "Hoàn thiện thủ công", "Limited Edition"],
    colors: 8,
    coverage: "15 m²",
    description: "Bộ sưu tập ván gỗ veneer tự nhiên cao cấp, mang vẻ đẹp nguyên bản của gỗ thật.",
    specifications: {
      thickness: "18mm",
      width: "180mm",
      length: "2200mm",
      material: "Plywood + Natural Veneer",
      finish: "Hand-crafted Oil Finish", 
      installation: "Chuyên gia lắp đặt"
    }
  },
  {
    id: 4,
    name: "SilkLux Eco-Friendly Wood Panel",
    category: "Eco Wood Panel",
    type: "Sustainable",
    rating: 4.6,
    reviews: 167,
    image: "/placeholder.svg",
    features: ["100% tái chế", "Thân thiện môi trường", "Chứng nhận FSC", "Carbon neutral"],
    colors: 10,
    coverage: "22 m²",
    description: "Ván gỗ sinh thái từ nguyên liệu tái chế, góp phần bảo vệ môi trường.",
    specifications: {
      thickness: "10mm",
      width: "120mm", 
      length: "2000mm",
      material: "Recycled Wood Fiber",
      finish: "Bio-based Coating",
      installation: "Adhesive mounting"
    }
  },
  {
    id: 5,
    name: "SilkLux Commercial Wood Panel System",
    category: "Commercial Wood Panel",
    type: "Heavy Duty",
    rating: 4.8,
    reviews: 98,
    image: "/placeholder.svg",
    features: ["Chịu tải cao", "Chống cháy", "Âm thanh cách âm", "Bảo trì thấp"],
    colors: 6,
    coverage: "25 m²",
    description: "Hệ thống ván gỗ thương mại chuyên dụng cho các công trình lớn và không gian công cộng.",
    specifications: {
      thickness: "20mm",
      width: "300mm",
      length: "3600mm",
      material: "Fire-retardant MDF",
      finish: "Commercial Grade Coating",
      installation: "Mechanical fastening"
    }
  },
  {
    id: 6,
    name: "SilkLux Quick Install Wood Panel",
    category: "DIY Wood Panel",
    type: "Easy Install",
    rating: 4.5,
    reviews: 312,
    image: "/placeholder.svg",
    features: ["Lắp đặt nhanh", "Không cần keo", "Hướng dẫn chi tiết", "Công cụ đi kèm"],
    colors: 14,
    coverage: "16 m²",
    description: "Ván gỗ DIY dễ lắp đặt, phù hợp cho người không chuyên với hệ thống click đơn giản.",
    specifications: {
      thickness: "8mm",
      width: "160mm",
      length: "1200mm", 
      material: "Laminated MDF",
      finish: "Scratch Resistant",
      installation: "Click & Lock System"
    }
  }
]

export const productCategories = [
  "All Products",
  "Interior Wood Panel", 
  "Exterior Wood Panel",
  "Luxury Wood Panel",
  "Eco Wood Panel", 
  "Commercial Wood Panel",
  "DIY Wood Panel"
]

export const productTypes = [
  "All Types",
  "Ultra Premium",
  "Weather Resistant", 
  "Natural Veneer",
  "Sustainable",
  "Heavy Duty",
  "Easy Install"
]
