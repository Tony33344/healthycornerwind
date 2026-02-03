import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const locale = searchParams.get('locale') || 'en'

    // Fallback data for testing
    const fallbackMenuItems = [
      {
        id: 'menu_001',
        name_sl: 'Alpska Zdrava Skleda',
        name_en: 'Alpine Healthy Bowl',
        name_nl: 'Alpine Gezonde Bowl',
        name_de: 'Alpine Gesunde Schüssel',
        description_sl: 'Hranljiva skleda z lokalnimi sestavinami',
        description_en: 'Nutritious bowl with local ingredients',
        description_nl: 'Voedzame bowl met lokale ingrediënten',
        description_de: 'Nahrhafte Schüssel mit lokalen Zutaten',
        price: 14.50,
        category: 'Meals',
        image_url: '/images/menu/alpine-bowl.jpg',
        stock: 25,
        status: 'published'
      },
      {
        id: 'menu_002',
        name_sl: 'Zeleni Smoothie',
        name_en: 'Green Smoothie',
        name_nl: 'Groene Smoothie',
        name_de: 'Grüner Smoothie',
        description_sl: 'Osvežujoč zeleni smoothie z špinačo in sadjem',
        description_en: 'Refreshing green smoothie with spinach and fruit',
        description_nl: 'Verfrissende groene smoothie met spinazie en fruit',
        description_de: 'Erfrischender grüner Smoothie mit Spinat und Obst',
        price: 7.50,
        category: 'Beverages',
        image_url: '/images/menu/green-smoothie.jpg',
        stock: 40,
        status: 'published'
      }
    ]

    try {
      let query = supabase
        .from('menu_items')
        .select('*')
        .eq('status', 'published')
        .is('deleted_at', null)
        .gt('stock', 0)
        .order('created_at', { ascending: false })

      if (category && category !== 'All') {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) {
        console.warn('Supabase error, using fallback data:', error)
        return NextResponse.json({ items: fallbackMenuItems }, { status: 200 })
      }

      // If no data from database, use fallback
      if (!data || data.length === 0) {
        console.log('No menu items in database, using fallback data')
        return NextResponse.json({ items: fallbackMenuItems }, { status: 200 })
      }

      return NextResponse.json({ items: data }, { status: 200 })
    } catch (dbError) {
      console.warn('Database connection failed, using fallback data:', dbError)
      return NextResponse.json({ items: fallbackMenuItems }, { status: 200 })
    }
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('menu_items')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ item: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating menu item:', error)
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    )
  }
}
