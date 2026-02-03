import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Helper function to initialize Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return null
  }
  
  return createClient(supabaseUrl, supabaseServiceKey)
}

interface AnalyticsData {
  overview: {
    totalBookings: number
    totalRevenue: number
    activeServices: number
    newsletterSubscribers: number
    todayBookings: number
    weeklyRevenue: number
    monthlyRevenue: number
    yearlyRevenue: number
  }
  bookingTrends: Array<{
    date: string
    bookings: number
    revenue: number
  }>
  popularServices: Array<{
    name: string
    bookings: number
    revenue: number
  }>
  recentActivity: Array<{
    id: string
    type: string
    title: string
    description: string
    timestamp: string
    user?: string
    status?: string
  }>
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'week' // week, month, year

    // Mock analytics data - replace with real Supabase queries
    const mockAnalytics: AnalyticsData = {
      overview: {
        totalBookings: 156,
        totalRevenue: 4250.00,
        activeServices: 8,
        newsletterSubscribers: 342,
        todayBookings: 12,
        weeklyRevenue: 1850.00,
        monthlyRevenue: 7500.00,
        yearlyRevenue: 45000.00
      },
      bookingTrends: [
        { date: '2024-01-08', bookings: 12, revenue: 380 },
        { date: '2024-01-09', bookings: 15, revenue: 450 },
        { date: '2024-01-10', bookings: 8, revenue: 240 },
        { date: '2024-01-11', bookings: 18, revenue: 540 },
        { date: '2024-01-12', bookings: 22, revenue: 660 },
        { date: '2024-01-13', bookings: 28, revenue: 840 },
        { date: '2024-01-14', bookings: 25, revenue: 750 }
      ],
      popularServices: [
        { name: 'Morning Yoga', bookings: 45, revenue: 1125 },
        { name: 'Ice Bathing', bookings: 38, revenue: 1330 },
        { name: 'Meditation', bookings: 32, revenue: 640 },
        { name: 'Massage', bookings: 28, revenue: 1400 },
        { name: 'Sauna', bookings: 22, revenue: 550 }
      ],
      recentActivity: [
        {
          id: '1',
          type: 'booking',
          title: 'New booking received',
          description: 'John Doe booked Morning Yoga',
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          user: 'John Doe',
          status: 'confirmed'
        },
        {
          id: '2',
          type: 'order',
          title: 'Order completed',
          description: 'Order #1234 - Alpine Healthy Bowl',
          timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
          user: 'Emma Smith',
          status: 'completed'
        }
      ]
    }

    // If Supabase is available, try to fetch real data
    if (supabase) {
      try {
        // Fetch total bookings
        const { count: bookingsCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })

        // Fetch active services
        const { count: servicesCount } = await supabase
          .from('services')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published')
          .is('deleted_at', null)

        // Fetch newsletter subscribers
        const { count: subscribersCount } = await supabase
          .from('newsletter_subscribers')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active')

        // Update overview with real data if available
        if (bookingsCount !== null) {
          mockAnalytics.overview.totalBookings = bookingsCount
        }
        if (servicesCount !== null) {
          mockAnalytics.overview.activeServices = servicesCount
        }
        if (subscribersCount !== null) {
          mockAnalytics.overview.newsletterSubscribers = subscribersCount
        }

        // Fetch popular services
        const { data: popularServices } = await supabase
          .from('services')
          .select('name_en, id')
          .eq('status', 'published')
          .is('deleted_at', null)
          .limit(5)

        if (popularServices && popularServices.length > 0) {
          // In a real implementation, join with bookings to get actual counts
          mockAnalytics.popularServices = popularServices.map((service, index) => ({
            name: service.name_en || 'Unnamed Service',
            bookings: mockAnalytics.popularServices[index]?.bookings || 0,
            revenue: mockAnalytics.popularServices[index]?.revenue || 0
          }))
        }
      } catch (dbError) {
        console.warn('Database query failed, using mock data:', dbError)
      }
    }

    return NextResponse.json({
      success: true,
      data: mockAnalytics,
      period
    }, { status: 200 })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch analytics data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST endpoint for recording custom analytics events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, data } = body

    // Log the event (in production, you'd save this to a database)
    console.log('Analytics event:', event, data)

    return NextResponse.json({
      success: true,
      message: 'Event recorded successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Analytics event recording error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to record event'
      },
      { status: 500 }
    )
  }
}
