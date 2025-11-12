'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Schedule {
  id: string
  day_of_week: number
  time: string
  service_id: string
  instructor: string
  capacity: number
  service?: {
    name_en: string
    category: string
  }
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function AdminSchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<number>(1) // Monday

  useEffect(() => {
    fetchSchedules()
  }, [])

  async function fetchSchedules() {
    try {
      const response = await fetch('/api/schedules')
      const data = await response.json()
      // Flatten the schedules from grouped format
      const allSchedules: Schedule[] = []
      Object.keys(data.schedules || {}).forEach(day => {
        data.schedules[day].forEach((schedule: Schedule) => {
          allSchedules.push(schedule)
        })
      })
      setSchedules(allSchedules)
    } catch (error) {
      console.error('Error fetching schedules:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteSchedule(id: string) {
    if (!confirm('Delete this schedule slot?')) return
    
    try {
      // TODO: Implement delete API
      alert('Schedule deleted!')
      fetchSchedules()
    } catch (error) {
      console.error('Error deleting schedule:', error)
    }
  }

  const daySchedules = schedules.filter(s => s.day_of_week === selectedDay)

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin/dashboard" className="text-[#A4B82C] hover:text-[#8A9824] text-sm font-medium mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-neutral-900">Schedule Management</h1>
              <p className="text-sm text-neutral-600 mt-1">Manage weekly activity schedule</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg font-medium transition-colors">
                📋 Copy Week
              </button>
              <button className="bg-[#A4B82C] hover:bg-[#8A9824] text-white px-6 py-3 rounded-lg font-bold transition-colors">
                + Add Slot
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Week Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Weekly Overview</h3>
          <div className="grid grid-cols-7 gap-2">
            {DAYS.map((day, index) => {
              const dayCount = schedules.filter(s => s.day_of_week === index).length
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(index)}
                  className={`p-4 rounded-lg text-center transition-all ${
                    selectedDay === index
                      ? 'bg-[#A4B82C] text-white shadow-lg scale-105'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  <div className="font-bold text-sm">{day.slice(0, 3)}</div>
                  <div className="text-2xl font-bold mt-1">{dayCount}</div>
                  <div className="text-xs mt-1 opacity-75">slots</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Day Schedule */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-[#A4B82C] text-white px-6 py-4">
            <h3 className="text-xl font-bold">{DAYS[selectedDay]}&apos;s Schedule</h3>
            <p className="text-sm text-white/80 mt-1">{daySchedules.length} activities scheduled</p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#A4B82C] border-t-transparent" />
            </div>
          ) : daySchedules.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-neutral-600 mb-4">No activities scheduled for {DAYS[selectedDay]}</p>
              <button className="bg-[#A4B82C] hover:bg-[#8A9824] text-white px-6 py-3 rounded-lg font-bold transition-colors">
                + Add First Activity
              </button>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {daySchedules
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((schedule, index) => (
                  <motion.div
                    key={schedule.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        {/* Time */}
                        <div className="text-center bg-neutral-100 rounded-lg p-3 min-w-[80px]">
                          <div className="text-2xl font-bold text-[#A4B82C]">
                            {schedule.time.slice(0, 5)}
                          </div>
                        </div>

                        {/* Activity Info */}
                        <div>
                          <h4 className="text-lg font-bold text-neutral-900">
                            {schedule.service?.name_en || 'Unknown Service'}
                          </h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-neutral-600">
                              👤 {schedule.instructor || 'TBD'}
                            </span>
                            <span className="text-sm text-neutral-600">
                              👥 {schedule.capacity} spots
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                              {schedule.service?.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button className="text-[#A4B82C] hover:text-[#8A9824] font-medium px-3 py-2">
                          Edit
                        </button>
                        <button
                          onClick={() => deleteSchedule(schedule.id)}
                          className="text-red-600 hover:text-red-900 font-medium px-3 py-2"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-neutral-600 mb-1">Total Weekly Slots</div>
            <div className="text-3xl font-bold text-[#A4B82C]">{schedules.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-neutral-600 mb-1">Total Capacity</div>
            <div className="text-3xl font-bold text-[#A4B82C]">
              {schedules.reduce((sum, s) => sum + s.capacity, 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-neutral-600 mb-1">Avg Capacity/Slot</div>
            <div className="text-3xl font-bold text-[#A4B82C]">
              {schedules.length > 0 
                ? Math.round(schedules.reduce((sum, s) => sum + s.capacity, 0) / schedules.length)
                : 0}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
