import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'healthy corner - ALPSKI ZDRAVILIŠKI KAMP',
  description: 'Wellness retreat platform for Camp Menina',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
