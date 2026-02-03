import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://healthycorner.si'),
  title: 'healthy corner - ALPSKI ZDRAVILIŠKI KAMP',
  description: 'Wellness retreat platform for Camp Menina',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
