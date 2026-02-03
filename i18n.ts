import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ requestLocale }) => {
  const supported = ['en', 'sl', 'nl', 'de']
  const requested = (await requestLocale) || 'en'
  const locale = supported.includes(requested) ? requested : 'en'

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  }
})
