import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupStorage() {
  console.log('🗄️ Setting up storage buckets...')
  
  try {
    // Create images bucket
    const { data: bucket, error: bucketError } = await supabase
      .storage
      .createBucket('images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
      })

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('✅ Images bucket already exists')
      } else {
        throw bucketError
      }
    } else {
      console.log('✅ Images bucket created')
    }

    // Set bucket to public
    const { error: updateError } = await supabase
      .storage
      .updateBucket('images', {
        public: true
      })

    if (updateError && !updateError.message.includes('already exists')) {
      console.error('Bucket update error:', updateError)
    }

    console.log('✅ Storage configuration complete\n')
    
  } catch (error) {
    console.error('❌ Error setting up storage:', error)
  }
}

setupStorage()
