'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface BookingData {
  date: string
  bookings: number
  revenue: number
}

interface BookingsChartProps {
  data?: BookingData[]
  period?: 'week' | 'month' | 'year'
}

export default function BookingsChart({ 
  data,
  period = 'week' 
}: BookingsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [chartData, setChartData] = useState<BookingData[]>([])
  const [maxValue, setMaxValue] = useState(0)

  useEffect(() => {
    // Use provided data or generate mock data
    const mockData: BookingData[] = data || [
      { date: 'Mon', bookings: 12, revenue: 380 },
      { date: 'Tue', bookings: 15, revenue: 450 },
      { date: 'Wed', bookings: 8, revenue: 240 },
      { date: 'Thu', bookings: 18, revenue: 540 },
      { date: 'Fri', bookings: 22, revenue: 660 },
      { date: 'Sat', bookings: 28, revenue: 840 },
      { date: 'Sun', bookings: 25, revenue: 750 }
    ]

    setChartData(mockData)
    setMaxValue(Math.max(...mockData.map(d => d.bookings)))
  }, [data])

  useEffect(() => {
    if (!canvasRef.current || chartData.length === 0) return

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

    // Chart dimensions
    const padding = 40
    const chartWidth = rect.width - padding * 2
    const chartHeight = rect.height - padding * 2
    const barWidth = chartWidth / (chartData.length * 2)
    const barGap = barWidth

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(rect.width - padding, y)
      ctx.stroke()
    }

    // Draw bars
    chartData.forEach((item, index) => {
      const x = padding + (barWidth + barGap) * index + barGap / 2
      const barHeight = (item.bookings / maxValue) * chartHeight
      const y = padding + chartHeight - barHeight

      // Draw bar with gradient
      const gradient = ctx.createLinearGradient(x, y, x, padding + chartHeight)
      gradient.addColorStop(0, '#84cc16') // lime-500
      gradient.addColorStop(1, '#bef264') // lime-300

      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw value on top of bar
      ctx.fillStyle = '#171717' // neutral-900
      ctx.font = 'bold 12px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText(item.bookings.toString(), x + barWidth / 2, y - 5)

      // Draw label below
      ctx.fillStyle = '#737373' // neutral-500
      ctx.font = '11px system-ui'
      ctx.fillText(item.date, x + barWidth / 2, rect.height - padding + 20)
    })

    // Draw Y-axis labels
    ctx.fillStyle = '#737373'
    ctx.font = '11px system-ui'
    ctx.textAlign = 'right'
    for (let i = 0; i <= 5; i++) {
      const value = Math.round((maxValue / 5) * (5 - i))
      const y = padding + (chartHeight / 5) * i
      ctx.fillText(value.toString(), padding - 10, y + 4)
    }
  }, [chartData, maxValue])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            Bookings Overview
          </h3>
          <p className="text-sm text-neutral-600">
            {period === 'week' ? 'Last 7 days' : period === 'month' ? 'Last 30 days' : 'Last 12 months'}
          </p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-lime-500 rounded"></div>
            <span className="text-sm text-neutral-600">Bookings</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: '300px' }}
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-200">
        <div>
          <p className="text-sm text-neutral-600">Total Bookings</p>
          <p className="text-xl font-bold text-neutral-900">
            {chartData.reduce((sum, item) => sum + item.bookings, 0)}
          </p>
        </div>
        <div>
          <p className="text-sm text-neutral-600">Average/Day</p>
          <p className="text-xl font-bold text-neutral-900">
            {Math.round(chartData.reduce((sum, item) => sum + item.bookings, 0) / chartData.length)}
          </p>
        </div>
        <div>
          <p className="text-sm text-neutral-600">Total Revenue</p>
          <p className="text-xl font-bold text-lime-600">
            €{chartData.reduce((sum, item) => sum + item.revenue, 0).toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
