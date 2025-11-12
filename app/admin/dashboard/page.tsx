'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Stats {
  totalServices: number
  totalMenuItems: number
  totalBookings: number
  totalRevenue: number
  recentBookings: number
  activeSchedules: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalServices: 0,
    totalMenuItems: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: 0,
    activeSchedules: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch stats from API
    async function fetchStats() {
      try {
        // TODO: Replace with real API calls
        setStats({
          totalServices: 5,
          totalMenuItems: 6,
          totalBookings: 24,
          totalRevenue: 1250.00,
          recentBookings: 8,
          activeSchedules: 20,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const menuItems = [
    {
      title: 'Services',
      description: 'Manage wellness services',
      icon: '🧘',
      href: '/admin/services',
      color: 'bg-blue-500',
      count: stats.totalServices
    },
    {
      title: 'Menu Items',
      description: 'Manage food & beverages',
      icon: '🥗',
      href: '/admin/menu',
      color: 'bg-green-500',
      count: stats.totalMenuItems
    },
    {
      title: 'Bookings',
      description: 'View and manage bookings',
      icon: '📅',
      href: '/admin/bookings',
      color: 'bg-purple-500',
      count: stats.totalBookings
    },
    {
      title: 'Schedule',
      description: 'Weekly activity schedule',
      icon: '⏰',
      href: '/admin/schedule',
      color: 'bg-orange-500',
      count: stats.activeSchedules
    },
    {
      title: 'Gallery',
      description: 'Manage photos',
      icon: '📸',
      href: '/admin/gallery',
      color: 'bg-pink-500',
      count: 0
    },
    {
      title: 'Testimonials',
      description: 'Manage reviews',
      icon: '⭐',
      href: '/admin/testimonials',
      color: 'bg-yellow-500',
      count: 0
    },
    {
      title: 'Pages',
      description: 'CMS content pages',
      icon: '📄',
      href: '/admin/pages',
      color: 'bg-indigo-500',
      count: 0
    },
    {
      title: 'Newsletter',
      description: 'Email subscribers',
      icon: '📧',
      href: '/admin/newsletter',
      color: 'bg-red-500',
      count: 0
    },
  ]

  const statsCards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: '📊', color: 'text-blue-600' },
    { label: 'Revenue', value: `€${stats.totalRevenue}`, icon: '💰', color: 'text-green-600' },
    { label: 'Recent Bookings', value: stats.recentBookings, icon: '🔔', color: 'text-purple-600' },
    { label: 'Active Schedules', value: stats.activeSchedules, icon: '📅', color: 'text-orange-600' },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 lowercase">
                healthy corner
              </h1>
              <p className="text-sm text-neutral-600 mt-1 uppercase tracking-wider">
                Admin Dashboard
              </p>
            </div>
            <Link
              href="/"
              className="text-sm text-[#A4B82C] hover:text-[#8A9824] font-medium"
            >
              ← View Site
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#A4B82C] to-[#8A9824] rounded-xl p-8 text-white mb-8"
        >
          <h2 className="text-2xl font-bold mb-2">Welcome to the Admin Panel! 👋</h2>
          <p className="text-white/90">
            Manage your entire wellness platform from here - services, bookings, content, and more.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 font-medium">{stat.label}</p>
                  <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <h3 className="text-xl font-bold text-neutral-900 mb-4">Content Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-neutral-200 hover:border-[#A4B82C] group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`text-4xl p-3 rounded-lg ${item.color} bg-opacity-10`}>
                    {item.icon}
                  </div>
                  {item.count > 0 && (
                    <span className="bg-neutral-100 text-neutral-700 text-xs font-bold px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </div>
                <h4 className="text-lg font-bold text-neutral-900 mb-1 group-hover:text-[#A4B82C] transition-colors">
                  {item.title}
                </h4>
                <p className="text-sm text-neutral-600">{item.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-bold text-blue-900 mb-3">💡 Quick Tips</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Click on any card above to manage that content type</li>
            <li>• All changes are saved automatically to the database</li>
            <li>• Use the &quot;View Site&quot; link to see your changes live</li>
            <li>• Content supports 4 languages: Slovenian, Dutch, English, German</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
