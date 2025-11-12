'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminRootPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard
    router.push('/admin/dashboard')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <div className="text-white text-xl">Redirecting to admin dashboard...</div>
    </div>
  )
}
