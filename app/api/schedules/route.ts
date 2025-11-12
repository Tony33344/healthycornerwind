import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        service:services(*)
      `)
      .order('day_of_week', { ascending: true })
      .order('time', { ascending: true })

    if (error) throw error

    // Group by day of week
    const schedulesByDay = data.reduce((acc: any, schedule: any) => {
      const day = schedule.day_of_week
      if (!acc[day]) acc[day] = []
      acc[day].push(schedule)
      return acc
    }, {})

    return NextResponse.json({ schedules: schedulesByDay }, { status: 200 })
  } catch (error) {
    console.error('Error fetching schedules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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
