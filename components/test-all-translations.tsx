'use client'

import { useLanguage } from '@/components/providers/language-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function TestAllTranslations() {
  const { t, locale, setLocale } = useLanguage()

  const testTranslations = [
    // Color Card translations
    { key: 'colorCard.orderSample', namespace: 'components', label: 'Order Sample' },
    { key: 'colorCard.popular', namespace: 'components', label: 'Popular' },
    { key: 'colorCard.form.firstName', namespace: 'components', label: 'First Name' },
    { key: 'colorCard.form.lastName', namespace: 'components', label: 'Last Name' },
    { key: 'colorCard.form.email', namespace: 'components', label: 'Email' },
    { key: 'colorCard.form.phone', namespace: 'components', label: 'Phone' },
    { key: 'colorCard.form.address', namespace: 'components', label: 'Address' },
    { key: 'colorCard.form.city', namespace: 'components', label: 'City' },
    { key: 'colorCard.form.state', namespace: 'components', label: 'State' },
    { key: 'colorCard.form.zipCode', namespace: 'components', label: 'Zip Code' },
    { key: 'colorCard.form.projectType', namespace: 'components', label: 'Project Type' },
    { key: 'colorCard.form.message', namespace: 'components', label: 'Message' },
    
    // Product Card translations
    { key: 'productCard.reviews', namespace: 'components', label: 'Reviews' },
    { key: 'productCard.coverage', namespace: 'components', label: 'Coverage' },
    { key: 'productCard.colors', namespace: 'components', label: 'Colors' },
    { key: 'productCard.gallon', namespace: 'components', label: 'Gallon' },
    
    // Cart translations
    { key: 'cart.addToCart', namespace: 'components', label: 'Add to Cart' },
    { key: 'cart.orderNow', namespace: 'components', label: 'Order Now' },
    { key: 'cart.orderInfo', namespace: 'components', label: 'Order Info' },
    { key: 'cart.submitOrder', namespace: 'components', label: 'Submit Order' },
    { key: 'cart.finish', namespace: 'components', label: 'Finish' },
    { key: 'cart.size', namespace: 'components', label: 'Size' },
    { key: 'cart.customerFormTitle', namespace: 'components', label: 'Customer Form Title' },
    { key: 'cart.submitInfo', namespace: 'components', label: 'Submit Info' },
    
    // Common translations
    { key: 'site.title', namespace: 'common', label: 'Site Title' },
    { key: 'navigation.paintColors', namespace: 'common', label: 'Paint Colors' },
    { key: 'header.findStore', namespace: 'common', label: 'Find Store' },
    { key: 'footer.description', namespace: 'common', label: 'Footer Description' },
  ]

  const missingTranslations = testTranslations.filter(test => {
    const translation = t(test.key, test.namespace)
    return translation === test.key // If translation not found, it returns the key
  })

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50 max-w-md max-h-96 overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Translation Test ({locale})</CardTitle>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant={locale === 'en' ? 'default' : 'outline'}
              onClick={() => setLocale('en')}
            >
              EN
            </Button>
            <Button 
              size="sm" 
              variant={locale === 'vi' ? 'default' : 'outline'}
              onClick={() => setLocale('vi')}
            >
              VI
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm">
              <strong>Status:</strong> {missingTranslations.length === 0 ? '✅ All Good' : `❌ ${missingTranslations.length} Missing`}
            </div>
            
            {missingTranslations.length > 0 && (
              <div className="text-xs text-red-600">
                <strong>Missing:</strong>
                <ul className="list-disc list-inside">
                  {missingTranslations.map((test, index) => (
                    <li key={index}>{test.label}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="text-xs space-y-1">
              <p><strong>Sample Translations:</strong></p>
              <p>Popular: {t('colorCard.popular', 'components')}</p>
              <p>Order: {t('cart.orderNow', 'components')}</p>
              <p>Reviews: {t('productCard.reviews', 'components')}</p>
              <p>Find Store: {t('header.findStore', 'common')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
