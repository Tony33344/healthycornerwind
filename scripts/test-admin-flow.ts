import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('👤 TESTING ADMIN AUTHENTICATION FLOW\n')

async function testAdminFlow() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    console.log('🔐 Testing admin login...')
    
    // Test admin login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@healthycorner.com',
      password: 'Admin123!Secure'
    })
    
    if (authError) {
      console.error('❌ Login failed:', authError.message)
      return
    }
    
    console.log('✅ Login successful!')
    console.log('   User ID:', authData.user.id)
    console.log('   Email:', authData.user.email)
    
    // Test session
    const { data: session } = await supabase.auth.getSession()
    console.log('✅ Session active:', !!session.session)
    
    // Test protected data access
    console.log('\n📊 Testing admin data access...')
    
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
    
    if (servicesError) {
      console.error('❌ Services access failed:', servicesError.message)
    } else {
      console.log('✅ Services access:', services.length, 'records')
    }
    
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('*')
    
    if (menuError) {
      console.error('❌ Menu access failed:', menuError.message)
    } else {
      console.log('✅ Menu access:', menuItems.length, 'records')
    }
    
    // Test CRUD operations
    console.log('\n✏️ Testing CRUD operations...')
    
    // Create test service
    const { data: newService, error: createError } = await supabase
      .from('services')
      .insert({
        name_sl: 'Test storitev',
        name_en: 'Test Service',
        name_nl: 'Test Service',
        name_de: 'Test Service',
        description_en: 'This is a test service for admin testing',
        price: 99.99,
        duration: 45,
        capacity: 5,
        category: 'Yoga',
        status: 'draft'
      })
      .select()
      .single()
    
    if (createError) {
      console.error('❌ Create failed:', createError.message)
    } else {
      console.log('✅ Create successful:', newService.name_en)
      
      // Update test service
      const { error: updateError } = await supabase
        .from('services')
        .update({ price: 89.99 })
        .eq('id', newService.id)
      
      if (updateError) {
        console.error('❌ Update failed:', updateError.message)
      } else {
        console.log('✅ Update successful')
      }
      
      // Delete test service
      const { error: deleteError } = await supabase
        .from('services')
        .delete()
        .eq('id', newService.id)
      
      if (deleteError) {
        console.error('❌ Delete failed:', deleteError.message)
      } else {
        console.log('✅ Delete successful')
      }
    }
    
    // Test logout
    console.log('\n🚪 Testing logout...')
    const { error: logoutError } = await supabase.auth.signOut()
    
    if (logoutError) {
      console.error('❌ Logout failed:', logoutError.message)
    } else {
      console.log('✅ Logout successful')
    }
    
  } catch (error) {
    console.error('❌ Admin flow test failed:', error)
  }
  
  console.log('\n🎯 Admin Flow Test Complete!\n')
}

testAdminFlow()
