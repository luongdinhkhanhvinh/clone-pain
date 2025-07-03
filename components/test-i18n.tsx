'use client'

import { useLanguage } from '@/components/providers/language-provider'

export function TestI18n() {
  const { t, locale, setLocale } = useLanguage()

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <h3 className="font-bold mb-2">{locale === 'vi' ? 'Kiểm tra i18n' : 'i18n Test'}</h3>
      <p className="text-sm mb-2">{locale === 'vi' ? 'Ngôn ngữ hiện tại' : 'Current locale'}: {locale}</p>
      <div className="space-y-2">
        <button 
          onClick={() => setLocale('en')}
          className="block w-full text-left px-2 py-1 bg-blue-100 rounded"
        >
          English
        </button>
        <button 
          onClick={() => setLocale('vi')}
          className="block w-full text-left px-2 py-1 bg-green-100 rounded"
        >
          Tiếng Việt
        </button>
      </div>
      <div className="mt-2 text-xs">
        <p>Site: {t('site.title')}</p>
        <p>Nav: {t('navigation.paintColors')}</p>
        <p>Component: {t('colorCard.popular', 'components')}</p>
        <p>Cart: {t('cart.addToCart', 'components')}</p>
      </div>
    </div>
  )
}
