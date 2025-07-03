export interface WoodPanelColor {
  id: number
  code: string
  name: string
  description: string
  hex: string
  image: string
  orderPercentage: string
  introduction: string
  category: string
  popular: boolean
}

export const woodPanelColors: WoodPanelColor[] = [
  {
    id: 1,
    code: "Jet Black",
    name: "Jet Black",
    description: "Đen tuyền",
    hex: "#000000",
    image: "/colors/JetBlack.png",
    orderPercentage: "25%",
    introduction: "Mạnh mẽ, hiện đại, dễ phối với mọi không gian nội thất.",
    category: "Neutral",
    popular: true
  },
  {
    id: 2,
    code: "Summer White",
    name: "Summer White",
    description: "Trắng sáng",
    hex: "#FFFFFF",
    image: "/colors/SummerWhite.png",
    orderPercentage: "25%",
    introduction: "Mang lại cảm giác rộng rãi, thanh lịch và tinh tế.",
    category: "Neutral",
    popular: true
  },
  {
    id: 3,
    code: "Chocolate",
    name: "Chocolate",
    description: "Nâu socola",
    hex: "#7B3F00",
    image: "/colors/Chocolate.png",
    orderPercentage: "10%",
    introduction: "Ấm áp, sang trọng, phù hợp nội thất cổ điển và hiện đại.",
    category: "Brown",
    popular: true
  },
  {
    id: 4,
    code: "Jungle Green",
    name: "Jungle Green",
    description: "Xanh rừng đậm",
    hex: "#355E3B",
    image: "/colors/JungleGreen.png",
    orderPercentage: "10%",
    introduction: "Tự nhiên, nổi bật, tạo chiều sâu cho không gian.",
    category: "Green",
    popular: true
  },
  {
    id: 5,
    code: "Warm Grey",
    name: "Warm Grey",
    description: "Xám ấm",
    hex: "#8B8680",
    image: "/colors/WarmGrey.png",
    orderPercentage: "5%",
    introduction: "Trung tính, dễ phối, mang nét hiện đại và tinh tế.",
    category: "Grey",
    popular: false
  },
  {
    id: 6,
    code: "Oat Meal",
    name: "Oat Meal",
    description: "Nâu yến mạch nhạt",
    hex: "#DDD6C7",
    image: "/colors/OatMeal.png",
    orderPercentage: "5%",
    introduction: "Nhẹ nhàng, mộc mạc, gần gũi thiên nhiên.",
    category: "Beige",
    popular: false
  },
  {
    id: 7,
    code: "CTB-4307",
    name: "Springhill Green",
    description: "Xanh lá non",
    hex: "#9ACD32",
    image: "/colors/CTB-4307SpringhillGreen.png",
    orderPercentage: "5%",
    introduction: "Tươi mới, trẻ trung, phù hợp phong cách eco.",
    category: "Green",
    popular: false
  },
  {
    id: 8,
    code: "CTB-4316",
    name: "Sanctuary",
    description: "Tím nhạt",
    hex: "#E6E6FA",
    image: "/colors/CTB-4316Sanctuary.png",
    orderPercentage: "5%",
    introduction: "Thoáng đạt, sáng tạo, tạo cảm giác thư thái.",
    category: "Purple",
    popular: false
  },
  {
    id: 9,
    code: "CTB-4318",
    name: "Coastal Cottage",
    description: "Nâu hồng be",
    hex: "#D2B48C",
    image: "/colors/CTB- 4318CoastalCottage.png",
    orderPercentage: "5%",
    introduction: "Mộc mạc nhưng tinh tế, đậm chất vintage.",
    category: "Beige",
    popular: false
  },
  {
    id: 10,
    code: "CTB-4301",
    name: "Labrador Blue",
    description: "Xanh lam",
    hex: "#4682B4",
    image: "/colors/CTB- 4301LabradorBlue.png",
    orderPercentage: "5%",
    introduction: "Mát mẻ, hiện đại, lý tưởng cho không gian làm việc.",
    category: "Blue",
    popular: false
  },
  {
    id: 11,
    code: "CTB-4320",
    name: "Majestic Yellow",
    description: "Vàng chanh nổi bật",
    hex: "#FFD700",
    image: "/colors/CTB- 4320 -MajesticYellow.png",
    orderPercentage: "5%",
    introduction: "Tươi sáng, rực rỡ, tạo điểm nhấn nổi bật.",
    category: "Yellow",
    popular: false
  },
  {
    id: 12,
    code: "CTB-4310",
    name: "Pink Pearl",
    description: "Hồng ngọc trai",
    hex: "#F8BBD9",
    image: "/colors/CTB- 4310 -PinkPearl.png",
    orderPercentage: "5%",
    introduction: "Dịu dàng, nữ tính, hợp không gian nhẹ nhàng.",
    category: "Pink",
    popular: false
  },
  {
    id: 13,
    code: "CTB-4308",
    name: "Terrapin Green",
    description: "Xanh rêu",
    hex: "#8FBC8F",
    image: "/colors/CTB- 4308 -TerrapinGreen.png",
    orderPercentage: "5%",
    introduction: "Trầm ấm, thiên nhiên, phù hợp với phong cách rustic.",
    category: "Green",
    popular: false
  },
  {
    id: 14,
    code: "CTB-4306",
    name: "Puritan Gray",
    description: "Xám xanh",
    hex: "#708090",
    image: "/colors/CTB- 4306-PuritanGray.png",
    orderPercentage: "5%",
    introduction: "Trang nhã, hiện đại, ứng dụng linh hoạt.",
    category: "Grey",
    popular: false
  },
  {
    id: 15,
    code: "CTB-4313",
    name: "CTB-4313",
    description: "Màu đặc biệt",
    hex: "#A0A0A0",
    image: "/placeholder.svg",
    orderPercentage: "0%",
    introduction: "Cần cập nhật thêm thông tin.",
    category: "Special",
    popular: false
  }
]

export const colorCategories = [
  "All",
  "Neutral", 
  "Brown",
  "Green",
  "Grey", 
  "Beige",
  "Purple",
  "Blue",
  "Yellow",
  "Pink",
  "Special"
]
