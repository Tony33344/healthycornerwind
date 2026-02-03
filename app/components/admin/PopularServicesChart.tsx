'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface ServiceData {
  name: string
  bookings: number
  revenue: number
  color: string
}

interface PopularServicesChartProps {
  data?: ServiceData[]
}

export default function PopularServicesChart({ data }: PopularServicesChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [serviceData, setServiceData] = useState<ServiceData[]>([])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    // Use provided data or generate mock data
    const mockData: ServiceData[] = data || [
      { name: 'Morning Yoga', bookings: 45, revenue: 1125, color: '#84cc16' },
      { name: 'Ice Bathing', bookings: 38, revenue: 1330, color: '#3b82f6' },
      { name: 'Meditation', bookings: 32, revenue: 640, color: '#8b5cf6' },
      { name: 'Massage', bookings: 28, revenue: 1400, color: '#ec4899' },
      { name: 'Sauna', bookings: 22, revenue: 550, color: '#f97316' }
    ]

    setServiceData(mockData)
  }, [data])

  useEffect(() => {
    if (!canvasRef.current || serviceData.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Calculate total bookings
    const totalBookings = serviceData.reduce((sum, item) => sum + item.bookings, 0)

    // Doughnut chart parameters
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const radius = Math.min(centerX, centerY) - 40
    const innerRadius = radius * 0.6

    let currentAngle = -Math.PI / 2 // Start at top

    // Draw each segment
    serviceData.forEach((item, index) => {
      const percentage = item.bookings / totalBookings
      const sliceAngle = percentage * 2 * Math.PI

      // Highlight hovered segment
      const isHovered = hoveredIndex === index
      const drawRadius = isHovered ? radius + 5 : radius

      // Draw outer arc
      ctx.beginPath()
      ctx.arc(centerX, centerY, drawRadius, currentAngle, currentAngle + sliceAngle)
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true)
      ctx.closePath()

      ctx.fillStyle = item.color
      ctx.fill()

      // Draw border
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()

      currentAngle += sliceAngle
    })

    // Draw center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI)
    ctx.fillStyle = '#ffffff'
    ctx.fill()

    // Draw center text
    ctx.fillStyle = '#171717'
    ctx.font = 'bold 24px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(totalBookings.toString(), centerX, centerY - 10)

    ctx.font = '14px system-ui'
    ctx.fillStyle = '#737373'
    ctx.fillText('Total Bookings', centerX, centerY + 15)
  }, [serviceData, hoveredIndex])

  const totalRevenue = serviceData.reduce((sum, item) => sum + item.revenue, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">
          Popular Services
        </h3>
        <p className="text-sm text-neutral-600">
          Top performing services this month
        </p>
      </div>

      {/* Chart */}
      <div className="relative mb-6">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: '280px' }}
        />
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {serviceData.map((service, index) => {
          const percentage = ((service.bookings / serviceData.reduce((sum, item) => sum + item.bookings, 0)) * 100).toFixed(1)
          
          return (
            <motion.div
              key={service.name}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: service.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900 truncate">
                    {service.name}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {service.bookings} bookings
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-neutral-900">
                  {percentage}%
                </p>
                <p className="text-sm text-lime-600">
                  €{service.revenue}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-neutral-600">Total Revenue</p>
            <p className="text-2xl font-bold text-lime-600">
              €{totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600">Avg. per Service</p>
            <p className="text-2xl font-bold text-neutral-900">
              €{(totalRevenue / serviceData.length).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
