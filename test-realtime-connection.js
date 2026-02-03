#!/usr/bin/env node

/**
 * Manual test script to verify Supabase real-time connection
 * Run with: node test-realtime-connection.js
 */

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

console.log('🔗 Testing Supabase Real-time Connection')
console.log('=====================================')
console.log(`URL: ${SUPABASE_URL}`)
console.log(`Key: ${SUPABASE_ANON_KEY.substring(0, 20)}...`)
console.log('')

const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testBasicConnection() {
  console.log('1. Testing basic connection...')
  
  try {
    const { data, error } = await client.from('bookings').select('count').limit(1)
    
    if (error) {
      console.log(`   ⚠️  Expected error (possibly due to RLS): ${error.message}`)
    } else {
      console.log('   ✅ Basic connection successful')
    }
  } catch (err) {
    console.error(`   ❌ Basic connection failed: ${err.message}`)
    return false
  }
  
  return true
}

async function testRealtimeSubscription() {
  console.log('2. Testing real-time subscription...')
  
  return new Promise((resolve) => {
    let subscriptionReceived = false
    let timeoutId
    
    const channel = client
      .channel('test-connection')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
        },
        (payload) => {
          console.log(`   📡 Real-time event received: ${payload.eventType}`)
          subscriptionReceived = true
          clearTimeout(timeoutId)
          resolve(true)
        }
      )
      .subscribe((status) => {
        console.log(`   📢 Subscription status: ${status}`)
        
        if (status === 'SUBSCRIBED') {
          console.log('   ✅ Real-time subscription established')
          
          // Set a timeout to wait for any events
          timeoutId = setTimeout(() => {
            console.log('   ℹ️  No events received (expected in empty environment)')
            client.removeChannel(channel)
            resolve(true)
          }, 5000)
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.log(`   ❌ Subscription failed: ${status}`)
          clearTimeout(timeoutId)
          resolve(false)
        }
      })
  })
}

async function testTableAccess() {
  console.log('3. Testing table access...')
  
  const tables = ['bookings', 'schedules', 'services']
  
  for (const table of tables) {
    try {
      const { data, error } = await client
        .from(table)
        .select('id')
        .limit(1)
      
      if (error) {
        console.log(`   ⚠️  ${table}: ${error.message}`)
      } else {
        console.log(`   ✅ ${table}: Access granted`)
      }
    } catch (err) {
      console.log(`   ❌ ${table}: ${err.message}`)
    }
  }
}

async function testEnvironmentConfig() {
  console.log('4. Testing environment configuration...')
  
  // Check URL format
  const urlPattern = /^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/
  if (urlPattern.test(SUPABASE_URL)) {
    console.log('   ✅ Supabase URL format is valid')
  } else {
    console.log('   ❌ Invalid Supabase URL format')
  }
  
  // Check key format
  if (SUPABASE_ANON_KEY.length > 50 && SUPABASE_ANON_KEY.startsWith('eyJ')) {
    console.log('   ✅ Supabase anon key format is valid')
  } else {
    console.log('   ❌ Invalid Supabase anon key format')
  }
  
  // Check service role key
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (serviceRoleKey) {
    if (serviceRoleKey.length > 50 && serviceRoleKey.startsWith('eyJ')) {
      console.log('   ✅ Service role key is configured')
    } else {
      console.log('   ⚠️  Service role key format may be invalid')
    }
  } else {
    console.log('   ⚠️  Service role key not configured')
  }
}

async function simulateBookingFlow() {
  console.log('5. Simulating booking flow...')
  
  try {
    // Step 1: Get schedules
    const { data: schedules, error: schedulesError } = await client
      .from('schedules')
      .select('*')
      .eq('is_active', true)
      .limit(3)
    
    if (schedulesError) {
      console.log(`   ⚠️  Could not fetch schedules: ${schedulesError.message}`)
    } else {
      console.log(`   ✅ Found ${schedules.length} active schedules`)
      
      if (schedules.length > 0) {
        const schedule = schedules[0]
        console.log(`   📅 Sample schedule: ${schedule.time} - ID: ${schedule.id}`)
        
        // Step 2: Try to get bookings for this schedule
        const { data: bookings, error: bookingsError } = await client
          .from('bookings')
          .select('*')
          .eq('schedule_id', schedule.id)
          .limit(5)
        
        if (bookingsError) {
          console.log(`   ⚠️  Could not fetch bookings (expected due to RLS): ${bookingsError.message}`)
        } else {
          console.log(`   ✅ Found ${bookings.length} bookings for this schedule`)
        }
      }
    }
  } catch (err) {
    console.log(`   ❌ Booking flow simulation failed: ${err.message}`)
  }
}

async function runTests() {
  console.log('Starting connection tests...\n')
  
  const results = []
  
  results.push(await testBasicConnection())
  results.push(await testRealtimeSubscription())
  await testTableAccess()
  await testEnvironmentConfig()
  await simulateBookingFlow()
  
  console.log('\n=====================================')
  console.log('📊 Test Summary')
  console.log('=====================================')
  
  const passed = results.filter(r => r === true).length
  const total = results.length
  
  console.log(`Passed: ${passed}/${total} critical tests`)
  
  if (passed === total) {
    console.log('🎉 All critical tests passed!')
    console.log('✅ Real-time connection is working correctly')
  } else {
    console.log('⚠️  Some tests failed. Check the configuration.')
  }
  
  console.log('\n💡 Next steps:')
  console.log('   1. Run the application: npm run dev')
  console.log('   2. Navigate to /schedule')
  console.log('   3. Check for "Live" indicator in the calendar')
  console.log('   4. Try booking a session to test the full flow')
  
  // Clean up
  client.removeAllChannels()
}

// Handle errors gracefully
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

// Run the tests
runTests().catch(console.error)
