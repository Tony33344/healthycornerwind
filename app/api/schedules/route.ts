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

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()

    // Fallback data for local development or when Supabase is not configured
    const fallbackSchedules = {
      1: [
        {
          id: '00000000-0000-0000-0000-000000000001',
          service_id: '00000000-0000-0000-0000-000000000101',
          day_of_week: 1,
          time: '07:00',
          capacity: 12,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          service: {
            id: '00000000-0000-0000-0000-000000000101',
            name_en: 'Morning Yoga',
            name_sl: 'Jutranja Joga',
            name_nl: 'Ochtend Yoga',
            name_de: 'Morgen Yoga',
            category: 'Yoga',
            duration: 60,
            price: 25.0,
            image_url: '/images/services/morning-yoga.jpg',
          },
        },
      ],
    }

    // If Supabase is not configured, return fallback so the UI still renders
    if (!supabase) {
      console.warn('Supabase configuration missing, using fallback schedule data')
      return NextResponse.json({ schedules: fallbackSchedules }, { status: 200 })
    }

    // Fetch schedules with related service using a generic select so it works
    // with both the initial schema and evolved schema variants.
    const { data, error } = await supabase
      .from('schedules')
      .select('*, services(*)')
      .order('day_of_week', { ascending: true })

    if (error) {
      console.error('Supabase error loading schedules:', error)
      return NextResponse.json({ schedules: fallbackSchedules }, { status: 200 })
    }

    if (!data || data.length === 0) {
      console.warn('No schedules in database, using fallback schedule data')
      return NextResponse.json({ schedules: fallbackSchedules }, { status: 200 })
    }

    // Normalize and transform data to match ScheduleWithService shape used in the app
    const transformedSchedules = data.map((row: any) => {
      const schedule = row
      const service = schedule.services || schedule.service || {}

      // Normalize day_of_week to 1-7 (Mon-Sun) for the frontend
      const rawDay: number = schedule.day_of_week ?? 0
      const dayOfWeek = rawDay === 0 ? 7 : rawDay

      // Derive time and capacity from whichever columns exist
      const time: string = schedule.time || schedule.start_time || '00:00'
      const capacity: number =
        schedule.capacity ?? schedule.max_participants ?? service.capacity ?? 1

      // Service name in multiple languages, falling back to a single name field
      const baseName =
        service.name_en ||
        service.name ||
        service.name_sl ||
        service.name_nl ||
        service.name_de ||
        'Service'

      const servicePayload = {
        id: service.id || schedule.service_id,
        name_sl: service.name_sl || baseName,
        name_nl: service.name_nl || baseName,
        name_en: service.name_en || baseName,
        name_de: service.name_de || baseName,
        category: service.category || 'Yoga',
        duration:
          service.duration ??
          service.duration_minutes ??
          null,
        price:
          typeof service.price === 'number'
            ? service.price
            : typeof service.price_eur === 'number'
            ? service.price_eur
            : 0,
        image_url: service.image_url || '/images/default-service.jpg',
      }

      return {
        id: schedule.id,
        service_id: schedule.service_id || service.id,
        day_of_week: dayOfWeek,
        time,
        capacity,
        is_active:
          schedule.is_active === false
            ? false
            : true,
        created_at: schedule.created_at,
        updated_at: schedule.updated_at,
        service: servicePayload,
      }
    })

    // Group by day_of_week for easier frontend consumption
    const schedulesByDay = transformedSchedules.reduce((acc: any, schedule: any) => {
      const day = schedule.day_of_week
      if (!acc[day]) acc[day] = []
      acc[day].push(schedule)
      return acc
    }, {})

    return NextResponse.json({ schedules: schedulesByDay }, { status: 200 })
  } catch (error) {
    console.error('Error fetching schedules:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()

    const { data, error } = await supabase
      .from('schedules')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ schedule: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating schedule:', error)
    return NextResponse.json(
      { error: 'Failed to create schedule' },
      { status: 500 }
    )
  }
}
