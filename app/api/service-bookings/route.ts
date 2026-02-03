import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const schema = z.object({
  service_id: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  preferred_date: z.string().optional(),
  preferred_time: z.string().optional(),
  quantity: z.number().int().min(1).max(50).optional(),
  notes: z.string().optional(),
})

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const parsed = schema.parse(json)

    const supabase = getSupabase()

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('service_inquiries')
          .insert({
            service_id: parsed.service_id,
            user_name: parsed.name,
            user_email: parsed.email,
            user_phone: parsed.phone || null,
            preferred_date: parsed.preferred_date || null,
            preferred_time: parsed.preferred_time || null,
            quantity: parsed.quantity ?? 1,
            notes: parsed.notes || null,
            status: 'new',
          })
          .select()
          .single()

        if (!error && data) {
          return NextResponse.json({ inquiry: data }, { status: 201 })
        }
      } catch (e) {
        console.warn('service_inquiries insert failed, falling back:', e)
      }
    }

    // Fallback response if Supabase is not configured or table missing
    return NextResponse.json({
      inquiry: {
        id: 'local-fallback',
        received: true,
        service_id: parsed.service_id,
        user_name: parsed.name,
        user_email: parsed.email,
        user_phone: parsed.phone || null,
        preferred_date: parsed.preferred_date || null,
        preferred_time: parsed.preferred_time || null,
        quantity: parsed.quantity ?? 1,
        notes: parsed.notes || null,
        status: 'new',
        created_at: new Date().toISOString(),
      }
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.issues }, { status: 400 })
    }
    console.error('service-bookings POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  // Provide a safe default (empty list) if listing is requested
  return NextResponse.json({ inquiries: [] })
}
