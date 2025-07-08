'use client'

import { ColorCard } from '@/components/colors/color-card'
import { ProductCard } from '@/components/products/product-card'
import { useLanguage } from '@/components/providers/language-provider'

export function DemoComponents() {
  const { t, locale } = useLanguage()

  const sampleColor = {
    id: 1,
    name: "Silk Fern",
    code: "SLX-2144",
    description: "A beautiful green color",
    hex: "#9CAF88",
    image: "",
    orderPercentage: "5%",
    introduction: "Perfect for nature-inspired designs",
    category: "Green",
    popular: true
  }

  const sampleProduct = {
    id: 1,
    name: "SilkLux Premium Interior wood",
    category: "Interior wood",
    type: "Ultra Premium",
    rating: 4.8,
    reviews: 156,
    image: "/placeholder.svg",
    features: ["Self-priming", "Zero VOC", "Washable"],
    colors: 3500,
    coverage: "400 sq ft",
    description: "Premium interior Silklux",
    baseColor: {
      id: 1,
      code: "SLX-2144",
      name: "Silk Fern",
      description: "A beautiful green color",
      hex: "#9CAF88",
      image: "",
      orderPercentage: "5%"
    },
    availableColors: [
      {
        id: 1,
        code: "SLX-2144",
        name: "Silk Fern",
        hex: "#9CAF88",
        image: ""
      }
    ]
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border z-50 max-w-md">
      <h3 className="font-bold mb-2">{locale === 'vi' ? 'Demo Component' : 'Component Demo'} ({locale})</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">{locale === 'vi' ? 'Thẻ Màu:' : 'Color Card:'}</h4>
          <div className="w-48">
            <ColorCard color={sampleColor} size="small" showCategory />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">{locale === 'vi' ? 'Thẻ Sản Phẩm (thu nhỏ):' : 'Product Card (scaled):'}</h4>
          <div className="w-48 scale-50 origin-top-left">
            <ProductCard product={sampleProduct} />
          </div>
        </div>

        <div className="text-xs space-y-1">
          <p><strong>{locale === 'vi' ? 'Kiểm tra dịch thuật:' : 'Translations test:'}</strong></p>
          <p>Popular: {t('colorCard.popular', 'components')}</p>
          <p>Add to Cart: {t('cart.addToCart', 'components')}</p>
          <p>Rating: {t('productCard.rating', 'components')}</p>
          <p>Coverage: {t('productCard.coverage', 'components')}</p>
        </div>
      </div>
    </div>
  )
}
