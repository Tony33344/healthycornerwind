'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

type ActivityType = 'Yoga' | 'Ice Bathing' | 'Workshop' | 'Meal'

interface ScheduleActivity {
  id: string
  time: string
  activity: string
  instructor: string
  type: ActivityType
  capacity: number
  available: number
}

const WEEKLY_SCHEDULE: Record<string, ScheduleActivity[]> = {
  Monday: [
    { id: 'm1', time: '07:00', activity: 'Morning Yoga', instructor: 'Ana', type: 'Yoga', capacity: 15, available: 8 },
    { id: 'm2', time: '09:00', activity: 'Ice Bath Session', instructor: 'Marko', type: 'Ice Bathing', capacity: 8, available: 3 },
    { id: 'm3', time: '12:00', activity: 'Healthy Lunch', instructor: 'Chef Sara', type: 'Meal', capacity: 30, available: 12 },
    { id: 'm4', time: '15:00', activity: 'Mindfulness Workshop', instructor: 'Dr. Luka', type: 'Workshop', capacity: 12, available: 5 },
    { id: 'm5', time: '18:00', activity: 'Evening Yoga', instructor: 'Ana', type: 'Yoga', capacity: 15, available: 10 },
  ],
  Tuesday: [
    { id: 't1', time: '07:00', activity: 'Sunrise Meditation', instructor: 'Ana', type: 'Yoga', capacity: 15, available: 6 },
    { id: 't2', time: '09:00', activity: 'Breathing & Ice Bath', instructor: 'Marko', type: 'Ice Bathing', capacity: 8, available: 4 },
    { id: 't3', time: '12:00', activity: 'Organic Lunch', instructor: 'Chef Sara', type: 'Meal', capacity: 30, available: 15 },
    { id: 't4', time: '15:00', activity: 'Nature Walk', instructor: 'Guide Petra', type: 'Workshop', capacity: 20, available: 12 },
  ],
  Wednesday: [
    { id: 'w1', time: '07:00', activity: 'Power Yoga', instructor: 'Ana', type: 'Yoga', capacity: 15, available: 7 },
    { id: 'w2', time: '09:00', activity: 'Ice Bath Experience', instructor: 'Marko', type: 'Ice Bathing', capacity: 8, available: 2 },
    { id: 'w3', time: '12:00', activity: 'Wellness Lunch', instructor: 'Chef Sara', type: 'Meal', capacity: 30, available: 18 },
    { id: 'w4', time: '15:00', activity: 'Nutrition Workshop', instructor: 'Dr. Nina', type: 'Workshop', capacity: 12, available: 8 },
  ],
  Thursday: [
    { id: 'th1', time: '07:00', activity: 'Gentle Yoga', instructor: 'Ana', type: 'Yoga', capacity: 15, available: 9 },
    { id: 'th2', time: '09:00', activity: 'Cold Therapy', instructor: 'Marko', type: 'Ice Bathing', capacity: 8, available: 5 },
    { id: 'th3', time: '12:00', activity: 'Healthy Cuisine', instructor: 'Chef Sara', type: 'Meal', capacity: 30, available: 14 },
    { id: 'th4', time: '15:00', activity: 'Sound Healing', instructor: 'Maestro Tomi', type: 'Workshop', capacity: 20, available: 11 },
  ],
  Friday: [
    { id: 'f1', time: '07:00', activity: 'Morning Flow Yoga', instructor: 'Ana', type: 'Yoga', capacity: 15, available: 6 },
    { id: 'f2', time: '09:00', activity: 'Ice Bath & Sauna', instructor: 'Marko', type: 'Ice Bathing', capacity: 8, available: 3 },
    { id: 'f3', time: '12:00', activity: 'Farm-to-Table Lunch', instructor: 'Chef Sara', type: 'Meal', capacity: 30, available: 16 },
    { id: 'f4', time: '18:00', activity: 'Sunset Meditation', instructor: 'Ana', type: 'Yoga', capacity: 15, available: 12 },
  ],
  Saturday: [
    { id: 's1', time: '08:00', activity: 'Weekend Yoga', instructor: 'Ana', type: 'Yoga', capacity: 15, available: 4 },
    { id: 's2', time: '10:00', activity: 'Ice Bath Journey', instructor: 'Marko', type: 'Ice Bathing', capacity: 8, available: 1 },
    { id: 's3', time: '12:30', activity: 'Special Menu', instructor: 'Chef Sara', type: 'Meal', capacity: 30, available: 10 },
    { id: 's4', time: '15:00', activity: 'Wellness Workshop', instructor: 'Dr. Luka', type: 'Workshop', capacity: 12, available: 7 },
  ],
  Sunday: [
    { id: 'su1', time: '08:00', activity: 'Restorative Yoga', instructor: 'Ana', type: 'Yoga', capacity: 15, available: 11 },
    { id: 'su2', time: '10:00', activity: 'Recovery Ice Bath', instructor: 'Marko', type: 'Ice Bathing', capacity: 8, available: 6 },
    { id: 'su3', time: '12:00', activity: 'Sunday Brunch', instructor: 'Chef Sara', type: 'Meal', capacity: 30, available: 20 },
  ],
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const TYPE_COLORS: Record<ActivityType, string> = {
  Yoga: 'bg-primary text-white',
  'Ice Bathing': 'bg-blue-500 text-white',
  Workshop: 'bg-purple-500 text-white',
  Meal: 'bg-orange-500 text-white',
}

export default function SchedulePage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('schedule')
  const [selectedDay, setSelectedDay] = useState('Monday')

  const schedule = WEEKLY_SCHEDULE[selectedDay] || []

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-700 mb-4">SCHEDULE</p>
            <div className="w-16 h-1 bg-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-neutral-900">
              Weekly Activities
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Plan your wellness journey with our structured weekly schedule
            </p>
          </motion.div>
        </div>
      </section>

      {/* Day Selector */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedDay === day
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Grid */}
      <section className="py-12 px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {schedule.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Time */}
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-neutral-900">{activity.time}</div>
                  </div>

                  {/* Activity Info */}
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-neutral-900 mb-1">{activity.activity}</h3>
                    <p className="text-neutral-600">Instructor: {activity.instructor}</p>
                  </div>

                  {/* Type Badge */}
                  <div className="flex-shrink-0">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${TYPE_COLORS[activity.type]}`}>
                      {activity.type}
                    </span>
                  </div>

                  {/* Availability */}
                  <div className="flex-shrink-0 text-center">
                    <div className="text-sm text-neutral-600 mb-1">Available</div>
                    <div className="text-xl font-bold text-primary">
                      {activity.available}/{activity.capacity}
                    </div>
                  </div>

                  {/* Book Button */}
                  <div className="flex-shrink-0">
                    <button
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        activity.available > 0
                          ? 'bg-primary text-white hover:bg-primary-dark'
                          : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                      }`}
                      disabled={activity.available === 0}
                    >
                      {activity.available > 0 ? 'Book Now' : 'Full'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Legend */}
          <div className="mt-12 p-6 bg-white rounded-lg">
            <h3 className="text-lg font-bold mb-4">Activity Types</h3>
            <div className="flex flex-wrap gap-4">
              {Object.entries(TYPE_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded-full ${color}`}></span>
                  <span className="text-neutral-700">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
