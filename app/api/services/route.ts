import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const locale = searchParams.get('locale') || 'en'
    const strict = process.env.STRICT_DATA === 'true'

    // Fallback data for testing
    const fallbackServices = [
      {
        id: 'srv_001',
        name_sl: 'Jutranja Joga',
        name_en: 'Morning Yoga',
        name_nl: 'Ochtend Yoga',
        name_de: 'Morgen Yoga',
        description_sl: 'Sproščujoča jutranja joga v naravi z razgledom na Alpe',
        description_en: 'Relaxing morning yoga in nature with Alpine views',
        description_nl: 'Ontspannende ochtendyoga in de natuur met uitzicht op de Alpen',
        description_de: 'Entspannende Morgen-Yoga in der Natur mit Alpenblick',
        price: 25.00,
        duration: 60,
        capacity: 12,
        category: 'Yoga',
        image_url: '/images/services/morning-yoga.jpg',
        status: 'published'
      },
      {
        id: 'srv_002',
        name_sl: 'Ledene Kopeli',
        name_en: 'Ice Bathing',
        name_nl: 'IJsbaden',
        name_de: 'Eisbaden',
        description_sl: 'Terapevtske ledene kopeli za krepitev imunskega sistema',
        description_en: 'Therapeutic ice baths for immune system strengthening',
        description_nl: 'Therapeutische ijsbaden voor versterking van het immuunsysteem',
        description_de: 'Therapeutische Eisbäder zur Stärkung des Immunsystems',
        price: 35.00,
        duration: 45,
        capacity: 8,
        category: 'Ice Bathing',
        image_url: '/images/services/ice-bathing.jpg',
        status: 'published'
      }
    ]

    try {
      let query = supabase
        .from('services')
        .select('*')
        .eq('status', 'published')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (category && category !== 'All') {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) {
        console.warn('Supabase error, using fallback data:', error)
        if (strict) {
          return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
        }
        return NextResponse.json({ services: fallbackServices }, { status: 200 })
      }

      if (!data || data.length === 0) {
        if (strict) {
          return NextResponse.json({ error: 'No services found' }, { status: 404 })
        }
        return NextResponse.json({ services: fallbackServices }, { status: 200 })
      }

      return NextResponse.json({ services: data }, { status: 200 })
    } catch (dbError) {
      console.warn('Database connection failed, using fallback data:', dbError)
      if (strict) {
        return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
      }
      return NextResponse.json({ services: fallbackServices }, { status: 200 })
    }
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('services')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ service: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
