import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupAdmin() {
  console.log('🔧 Setting up admin user...')
  
  try {
    // Create admin user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@healthycorner.com',
      password: 'Admin123!Secure',
      email_confirm: true
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('✅ Admin user already exists')
        // Get existing user
        const { data: users } = await supabase.auth.admin.listUsers()
        const adminUser = users?.users?.find((u: any) => u.email === 'admin@healthycorner.com')
        
        if (adminUser) {
          // Update profile
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: adminUser.id,
              role: 'admin',
              last_active_at: new Date().toISOString()
            })
          
          if (profileError) {
            console.error('Profile update error:', profileError)
          } else {
            console.log('✅ Admin profile updated')
          }
        }
      } else {
        throw authError
      }
    } else {
      console.log('✅ Admin user created:', authData.user.email)
      
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          role: 'admin',
          last_active_at: new Date().toISOString()
        })
      
      if (profileError) {
        console.error('Profile creation error:', profileError)
      } else {
        console.log('✅ Admin profile created')
      }
    }

    console.log('\n📧 Admin Credentials:')
    console.log('Email: admin@healthycorner.com')
    console.log('Password: Admin123!Secure')
    console.log('Login at: http://localhost:3002/admin/login\n')
    
  } catch (error) {
    console.error('❌ Error setting up admin:', error)
  }
}

setupAdmin()
