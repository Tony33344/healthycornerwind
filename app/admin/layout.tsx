import { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Admin Dashboard - healthy corner',
  description: 'Content management system for healthy corner wellness platform',
  robots: 'noindex, nofollow', // Don't index admin pages
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {children}
    </div>
  )
}
