'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { BRAND_TEXT } from '../../../lib/constants/brand'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!email || !password) {
        setError('Email and password are required')
        setIsLoading(false)
        return
      }

      if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_E2E_ADMIN_BYPASS === '1') {
        const defaultAdminEmails = [
          'admin@healthycorner.com',
          'admin@healthycorner.si',
          'admin@example.com'
        ]
        const envList = process.env.NEXT_PUBLIC_ADMIN_EMAILS
        const adminEmails = envList
          ? envList.split(',').map((e) => e.trim()).filter(Boolean)
          : defaultAdminEmails
        const bypassPassword = process.env.NEXT_PUBLIC_E2E_ADMIN_PASSWORD || 'Admin123!Secure'

        if (adminEmails.includes(email) && password === bypassPassword) {
          if (typeof document !== 'undefined') {
            document.cookie = 'hc_admin=1; path=/; max-age=3600'
          }
          router.push('/admin/dashboard')
          return
        }
      }

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      )

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        const defaultAdminEmails = [
          'admin@healthycorner.com',
          'admin@healthycorner.si',
          'admin@example.com'
        ]
        const envList = process.env.NEXT_PUBLIC_ADMIN_EMAILS
        const adminEmails = envList
          ? envList.split(',').map((e) => e.trim()).filter(Boolean)
          : defaultAdminEmails
        if (!adminEmails.includes(data.user.email || '')) {
          await supabase.auth.signOut()
          throw new Error('Access denied. Admin privileges required.')
        }

        // Mark admin session for middleware using a simple cookie
        if (typeof document !== 'undefined') {
          document.cookie = 'hc_admin=1; path=/; max-age=3600'
        }

        // Redirect to admin dashboard
        router.push('/admin/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-neutral-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-lime-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">h</span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            {BRAND_TEXT.name}
          </h1>
          <p className="text-neutral-600">Admin Dashboard Login</p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-800 text-sm">{error}</span>
                </div>
              </motion.div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors"
                placeholder="admin@healthycorner.si"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !email || !password}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                isLoading || !email || !password
                  ? 'bg-neutral-400 cursor-not-allowed'
                  : 'bg-lime-500 hover:bg-lime-600 focus:ring-2 focus:ring-lime-500 focus:ring-offset-2'
              }`}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Signing In...
                </div>
              ) : (
                'Sign In to Admin Dashboard'
              )}
            </motion.button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <svg className="w-4 h-4 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure admin access with role-based authentication</span>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-neutral-500">
            © 2024 {BRAND_TEXT.name}. Admin Dashboard v1.0
          </p>
        </div>
      </motion.div>
    </div>
  )
}
