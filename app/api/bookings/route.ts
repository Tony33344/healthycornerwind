import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { 
  validateBookingRequest, 
  generateBookingNumber,
  canCancelBooking,
  canConfirmBooking 
} from '../../lib/utils/booking'

// Helper function to initialize Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return null
  }
  
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Request validation schema
const createBookingSchema = z.object({
  schedule_id: z.string().uuid(),
  user_name: z.string().min(2).max(100),
  user_email: z.string().email(),
  user_phone: z.string().nullable().optional(),
  // Store booking_date as a DATE (YYYY-MM-DD) to match the database schema
  booking_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (expected YYYY-MM-DD)'),
  notes: z.string().max(500).optional(),
})

const updateBookingSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  notes: z.string().max(500).optional(),
})

// GET /api/bookings - Fetch bookings
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()

    // Require Supabase configuration - no fallbacks
    if (!supabase) {
      console.error('Supabase configuration missing')
      return NextResponse.json(
        { error: 'Database configuration required' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const scheduleId = searchParams.get('schedule_id')
    const userId = searchParams.get('user_id')
    const status = searchParams.get('status')
    const date = searchParams.get('date')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('bookings')
      .select(`
        *,
        schedules (
          id,
          time,
          day_of_week,
          capacity,
          services (
            id,
            name_en,
            name_sl,
            name_nl,
            name_de,
            category,
            duration,
            price
          )
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (scheduleId) {
      query = query.eq('schedule_id', scheduleId)
    }
    if (userId) {
      query = query.eq('user_id', userId)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (date) {
      query = query.eq('booking_date', date)
    }

    const { data: bookings, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch bookings from database' },
        { status: 500 }
      )
    }

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Create new booking
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
    
    // Validate request body
    const validatedData = createBookingSchema.parse(body)
    
    // Get schedule details
    const { data: schedule, error: scheduleError } = await supabase
      .from('schedules')
      .select('*')
      .eq('id', validatedData.schedule_id)
      .single()

    if (scheduleError || !schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      )
    }

    // Get existing bookings for validation
    const { data: existingBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('schedule_id', validatedData.schedule_id)
      .eq('booking_date', validatedData.booking_date)

    if (bookingsError) {
      console.error('Error fetching existing bookings:', bookingsError)
      return NextResponse.json(
        { error: 'Failed to validate booking' },
        { status: 500 }
      )
    }

    // Validate booking request
    const validation = validateBookingRequest(
      schedule,
      existingBookings || [],
      validatedData.booking_date
    )

    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Create booking
    const bookingData = {
      ...validatedData,
      booking_number: generateBookingNumber(),
      status: 'pending',
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      )
    }

    // TODO: Send confirmation email
    // await sendBookingConfirmationEmail(booking)

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/bookings - Update booking
export async function PATCH(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('id')

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = updateBookingSchema.parse(body)

    // Get existing booking
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select(`
        *,
        schedules (
          id,
          time,
          day_of_week,
          capacity
        )
      `)
      .eq('id', bookingId)
      .single()

    if (fetchError || !existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Validate status change
    if (validatedData.status === 'confirmed' && !canConfirmBooking(existingBooking)) {
      return NextResponse.json(
        { error: 'Cannot confirm this booking' },
        { status: 400 }
      )
    }

    if (validatedData.status === 'cancelled') {
      const cancellationCheck = canCancelBooking(existingBooking, existingBooking.schedules)
      if (!cancellationCheck.canCancel) {
        return NextResponse.json(
          { error: cancellationCheck.reason },
          { status: 400 }
        )
      }
    }

    // Update booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to update booking' },
        { status: 500 }
      )
    }

    // TODO: Send notification email
    // if (validatedData.status === 'confirmed') {
    //   await sendBookingConfirmedEmail(booking)
    // }
    // if (validatedData.status === 'cancelled') {
    //   await sendBookingCancelledEmail(booking)
    // }

    return NextResponse.json({ booking })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/bookings - Delete booking
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('id')

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // Get booking details for validation
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select(`
        *,
        schedules (
          id,
          time,
          day_of_week,
          capacity
        )
      `)
      .eq('id', bookingId)
      .single()

    if (fetchError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if booking can be cancelled
    const cancellationCheck = canCancelBooking(booking, booking.schedules)
    if (!cancellationCheck.canCancel) {
      return NextResponse.json(
        { error: cancellationCheck.reason },
        { status: 400 }
      )
    }

    // Soft delete by marking as cancelled
    const { error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to cancel booking' },
        { status: 500 }
      )
    }

    // TODO: Send cancellation email
    // await sendBookingCancelledEmail(booking)

    return NextResponse.json({ message: 'Booking cancelled successfully' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
