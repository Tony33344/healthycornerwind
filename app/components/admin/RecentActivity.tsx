'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Activity {
  id: string
  type: 'booking' | 'order' | 'newsletter' | 'contact' | 'review'
  title: string
  description: string
  timestamp: Date
  user?: string
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

interface RecentActivityProps {
  activities?: Activity[]
  limit?: number
}

export default function RecentActivity({ 
  activities,
  limit = 10 
}: RecentActivityProps) {
  const [activityData, setActivityData] = useState<Activity[]>([])
  const [filter, setFilter] = useState<Activity['type'] | 'all'>('all')

  useEffect(() => {
    // Use provided data or generate mock data
    const mockActivities: Activity[] = activities || [
      {
        id: '1',
        type: 'booking',
        title: 'New booking received',
        description: 'John Doe booked Morning Yoga for tomorrow',
        timestamp: new Date(Date.now() - 5 * 60000),
        user: 'John Doe',
        status: 'confirmed'
      },
      {
        id: '2',
        type: 'order',
        title: 'Order completed',
        description: 'Order #1234 - Alpine Healthy Bowl',
        timestamp: new Date(Date.now() - 15 * 60000),
        user: 'Emma Smith',
        status: 'completed'
      },
      {
        id: '3',
        type: 'newsletter',
        title: 'New subscriber',
        description: 'jane@example.com subscribed to newsletter',
        timestamp: new Date(Date.now() - 30 * 60000),
        status: 'confirmed'
      },
      {
        id: '4',
        type: 'booking',
        title: 'Booking cancelled',
        description: 'Mike Johnson cancelled Ice Bathing session',
        timestamp: new Date(Date.now() - 45 * 60000),
        user: 'Mike Johnson',
        status: 'cancelled'
      },
      {
        id: '5',
        type: 'contact',
        title: 'Contact form submitted',
        description: 'New inquiry about group bookings',
        timestamp: new Date(Date.now() - 60 * 60000),
        status: 'pending'
      },
      {
        id: '6',
        type: 'review',
        title: 'New review posted',
        description: 'Sarah Williams left a 5-star review',
        timestamp: new Date(Date.now() - 90 * 60000),
        status: 'confirmed'
      },
      {
        id: '7',
        type: 'order',
        title: 'New order placed',
        description: 'Order #1235 - Green Smoothie x2',
        timestamp: new Date(Date.now() - 120 * 60000),
        user: 'Tom Brown',
        status: 'pending'
      },
      {
        id: '8',
        type: 'booking',
        title: 'New booking received',
        description: 'Lisa Anderson booked Meditation session',
        timestamp: new Date(Date.now() - 150 * 60000),
        user: 'Lisa Anderson',
        status: 'confirmed'
      }
    ]

    setActivityData(mockActivities.slice(0, limit))
  }, [activities, limit])

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'booking':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case 'order':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        )
      case 'newsletter':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      case 'contact':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )
      case 'review':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        )
    }
  }

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'booking': return 'bg-blue-100 text-blue-600'
      case 'order': return 'bg-lime-100 text-lime-600'
      case 'newsletter': return 'bg-purple-100 text-purple-600'
      case 'contact': return 'bg-orange-100 text-orange-600'
      case 'review': return 'bg-pink-100 text-pink-600'
    }
  }

  const getStatusBadge = (status?: Activity['status']) => {
    if (!status) return null

    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const filteredActivities = filter === 'all' 
    ? activityData 
    : activityData.filter(a => a.type === filter)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-lg border border-neutral-200"
    >
      {/* Header with Filters */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Recent Activity
            </h3>
            <p className="text-sm text-neutral-600">
              Latest updates and actions
            </p>
          </div>
          <span className="px-3 py-1 bg-lime-100 text-lime-700 rounded-full text-sm font-medium">
            {filteredActivities.length} items
          </span>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'booking', 'order', 'newsletter', 'contact', 'review'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === type
                  ? 'bg-lime-500 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="max-h-[500px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="p-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex gap-3">
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-medium text-neutral-900">
                      {activity.title}
                    </p>
                    {getStatusBadge(activity.status)}
                  </div>
                  <p className="text-sm text-neutral-600 mb-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatTimestamp(activity.timestamp)}</span>
                    {activity.user && (
                      <>
                        <span>•</span>
                        <span>{activity.user}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-200">
        <button className="w-full py-2 text-sm font-medium text-lime-600 hover:text-lime-700 hover:bg-lime-50 rounded-lg transition-colors">
          View All Activity →
        </button>
      </div>
    </motion.div>
  )
}
