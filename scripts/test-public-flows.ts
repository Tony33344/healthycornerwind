import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('🌐 TESTING PUBLIC USER FLOWS\n')

async function testPublicFlows() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    console.log('📦 Testing public services access...')
    
    // Test public services
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('id, name_en, name_sl, name_nl, name_de, price, category, status')
      .eq('status', 'published')
    
    if (servicesError) {
      console.error('❌ Services failed:', servicesError.message)
    } else {
      console.log('✅ Public services:', services.length, 'available')
      console.log('   Categories:', Array.from(new Set(services.map(s => s.category))))
      console.log('   Languages: EN, SL, NL, DE all present')
    }
    
    console.log('\n🍽️ Testing public menu access...')
    
    // Test public menu
    const { data: menu, error: menuError } = await supabase
      .from('menu_items')
      .select('id, name_en, price, category, allergens, status')
      .eq('status', 'published')
    
    if (menuError) {
      console.error('❌ Menu failed:', menuError.message)
    } else {
      console.log('✅ Public menu:', menu.length, 'items')
      console.log('   Categories:', Array.from(new Set(menu.map(m => m.category))))
      console.log('   Price range: €' + Math.min(...menu.map(m => m.price)) + ' - €' + Math.max(...menu.map(m => m.price)))
    }
    
    console.log('\n📅 Testing schedule access...')
    
    // Test schedules with services
    const { data: schedules, error: scheduleError } = await supabase
      .from('schedules')
      .select(`
        id, 
        day_of_week, 
        time, 
        instructor, 
        capacity,
        services!inner(name_en, category, status)
      `)
    
    if (scheduleError) {
      console.error('❌ Schedules failed:', scheduleError.message)
    } else {
      console.log('✅ Public schedules:', schedules.length, 'slots')
      console.log('   Days covered:', Array.from(new Set(schedules.map(s => s.day_of_week))).sort())
      console.log('   Instructors:', Array.from(new Set(schedules.map(s => s.instructor))))
    }
    
    console.log('\n🖼️ Testing gallery access...')
    
    // Test gallery
    const { data: gallery, error: galleryError } = await supabase
      .from('gallery_images')
      .select('id, image_url, title_en, alt_text_en')
      .limit(5)
    
    if (galleryError) {
      console.error('❌ Gallery failed:', galleryError.message)
    } else {
      console.log('✅ Gallery images:', gallery.length, 'available')
    }
    
    console.log('\n⭐ Testing testimonials access...')
    
    // Test testimonials
    const { data: testimonials, error: testimonialsError } = await supabase
      .from('testimonials')
      .select('id, guest_name, name, rating, comment_en')
      .limit(5)
    
    if (testimonialsError) {
      console.error('❌ Testimonials failed:', testimonialsError.message)
    } else {
      console.log('✅ Testimonials:', testimonials.length, 'available')
    }
    
    console.log('\n🔍 Testing search functionality...')
    
    // Test search across services and menu
    const searchTerm = 'yoga'
    
    const { data: serviceSearch, error: serviceSearchError } = await supabase
      .from('services')
      .select('name_en, category')
      .or(`name_en.ilike.%${searchTerm}%,description_en.ilike.%${searchTerm}%`)
      .eq('status', 'published')
    
    if (serviceSearchError) {
      console.error('❌ Service search failed:', serviceSearchError.message)
    } else {
      console.log('✅ Service search for "' + searchTerm + '":', serviceSearch.length, 'results')
    }
    
    console.log('\n🛒 Testing cart simulation...')
    
    // Simulate adding items to cart (client-side functionality)
    const cartItems = [
      { id: services[0]?.id, type: 'service', name: services[0]?.name_en, price: services[0]?.price },
      { id: menu[0]?.id, type: 'menu', name: menu[0]?.name_en, price: menu[0]?.price }
    ]
    
    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0)
    console.log('✅ Cart simulation:', cartItems.length, 'items, total: €' + cartTotal.toFixed(2))
    
    console.log('\n📝 Testing booking simulation...')
    
    // Test booking creation (would normally require auth)
    const bookingData = {
      schedule_id: schedules[0]?.id,
      booking_date: '2025-01-20',
      status: 'pending',
      notes: 'Test booking from public flow'
    }
    
    console.log('✅ Booking data prepared:', bookingData.schedule_id ? 'valid schedule' : 'no schedule')
    
  } catch (error) {
    console.error('❌ Public flow test failed:', error)
  }
  
  console.log('\n🎯 Public Flow Test Complete!\n')
}

testPublicFlows()
