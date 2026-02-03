import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { CartProvider } from '../context/CartContext'
import '../globals.css'
import HtmlLang from '../components/HtmlLang'

const locales = ['sl', 'nl', 'en', 'de']

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound()

  // Enable static rendering for this locale
  setRequestLocale(locale)

  // Load localized messages
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <CartProvider>
        <HtmlLang locale={locale} />
        <Navigation />
        <main className="pt-16 relative z-0">{children}</main>
        <Footer />
      </CartProvider>
    </NextIntlClientProvider>
  )
}
