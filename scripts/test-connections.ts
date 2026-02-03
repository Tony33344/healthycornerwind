import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('🧪 COMPREHENSIVE CONNECTION TESTING\n')

async function testConnections() {
  console.log('🔗 Testing Supabase Connections...\n')
  
  // Test service role connection
  const serviceClient = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    console.log('1️⃣ Service Role Connection:')
    const { data: services, error } = await serviceClient
      .from('services')
      .select('id, name_en, price, category')
      .limit(3)
    
    if (error) throw error
    console.log('✅ Service role works -', services.length, 'services found')
    console.log('   Sample:', services[0]?.name_en || 'No services')
    
  } catch (error) {
    console.error('❌ Service role failed:', error)
  }

  // Test anon connection
  const anonClient = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    console.log('\n2️⃣ Anonymous Connection:')
    const { data: publicServices, error } = await anonClient
      .from('services')
      .select('id, name_en, price')
      .eq('status', 'published')
      .limit(3)
    
    if (error) throw error
    console.log('✅ Anonymous works -', publicServices.length, 'public services')
    
  } catch (error) {
    console.error('❌ Anonymous failed:', error)
  }

  // Test storage
  try {
    console.log('\n3️⃣ Storage Connection:')
    const { data: buckets, error } = await serviceClient.storage.listBuckets()
    
    if (error) throw error
    const imagesBucket = buckets.find(b => b.name === 'images')
    console.log('✅ Storage works - images bucket:', imagesBucket ? 'exists' : 'missing')
    
  } catch (error) {
    console.error('❌ Storage failed:', error)
  }

  // Test auth
  try {
    console.log('\n4️⃣ Auth Connection:')
    const { data: users, error } = await serviceClient.auth.admin.listUsers()
    
    if (error) throw error
    const adminUser = users.users.find((u: any) => u.email === 'admin@healthycorner.com')
    console.log('✅ Auth works - admin user:', adminUser ? 'exists' : 'missing')
    
  } catch (error) {
    console.error('❌ Auth failed:', error)
  }

  // Test all tables
  const tables = ['services', 'menu_items', 'schedules', 'gallery_images', 'testimonials']
  
  console.log('\n5️⃣ Database Tables:')
  for (const table of tables) {
    try {
      const { count, error } = await serviceClient
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (error) throw error
      console.log(`✅ ${table}: ${count} records`)
      
    } catch (error) {
      console.log(`❌ ${table}: ${error.message}`)
    }
  }

  console.log('\n🎯 Connection Test Complete!\n')
}

testConnections()
