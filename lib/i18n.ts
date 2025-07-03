import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

export const useI18n = () => {
  const { t } = useTranslation()
  const router = useRouter()
  
  const changeLanguage = (locale: string) => {
    router.push(router.asPath, router.asPath, { locale })
  }
  
  return {
    t,
    locale: router.locale,
    changeLanguage,
    locales: router.locales,
  }
}

export const getStaticTranslations = async (locale: string, namespaces: string[] = ['common']) => {
  const { serverSideTranslations } = await import('next-i18next/serverSideTranslations')
  return await serverSideTranslations(locale, namespaces)
}
