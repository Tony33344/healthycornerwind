import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

console.log('🔒 FIXING RLS POLICIES FOR ADMIN ACCESS\n')

async function fixRLSPolicies() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  const policies = [
    // Services policies
    {
      table: 'services',
      policy: 'services_select_policy',
      sql: `
        CREATE POLICY services_select_policy ON services
        FOR SELECT USING (true);
      `
    },
    {
      table: 'services',
      policy: 'services_insert_policy', 
      sql: `
        CREATE POLICY services_insert_policy ON services
        FOR INSERT WITH CHECK (true);
      `
    },
    {
      table: 'services',
      policy: 'services_update_policy',
      sql: `
        CREATE POLICY services_update_policy ON services
        FOR UPDATE USING (true);
      `
    },
    {
      table: 'services',
      policy: 'services_delete_policy',
      sql: `
        CREATE POLICY services_delete_policy ON services
        FOR DELETE USING (true);
      `
    },
    
    // Menu items policies
    {
      table: 'menu_items',
      policy: 'menu_items_select_policy',
      sql: `
        CREATE POLICY menu_items_select_policy ON menu_items
        FOR SELECT USING (true);
      `
    },
    {
      table: 'menu_items',
      policy: 'menu_items_insert_policy',
      sql: `
        CREATE POLICY menu_items_insert_policy ON menu_items
        FOR INSERT WITH CHECK (true);
      `
    },
    {
      table: 'menu_items',
      policy: 'menu_items_update_policy',
      sql: `
        CREATE POLICY menu_items_update_policy ON menu_items
        FOR UPDATE USING (true);
      `
    },
    {
      table: 'menu_items',
      policy: 'menu_items_delete_policy',
      sql: `
        CREATE POLICY menu_items_delete_policy ON menu_items
        FOR DELETE USING (true);
      `
    },
    
    // Schedules policies
    {
      table: 'schedules',
      policy: 'schedules_select_policy',
      sql: `
        CREATE POLICY schedules_select_policy ON schedules
        FOR SELECT USING (true);
      `
    },
    {
      table: 'schedules',
      policy: 'schedules_insert_policy',
      sql: `
        CREATE POLICY schedules_insert_policy ON schedules
        FOR INSERT WITH CHECK (true);
      `
    },
    {
      table: 'schedules',
      policy: 'schedules_update_policy',
      sql: `
        CREATE POLICY schedules_update_policy ON schedules
        FOR UPDATE USING (true);
      `
    },
    {
      table: 'schedules',
      policy: 'schedules_delete_policy',
      sql: `
        CREATE POLICY schedules_delete_policy ON schedules
        FOR DELETE USING (true);
      `
    }
  ]
  
  try {
    console.log('🔧 Enabling RLS on tables...')
    
    // Enable RLS on all tables
    const tables = ['services', 'menu_items', 'schedules', 'gallery_images', 'testimonials']
    
    for (const table of tables) {
      const { error } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`
      })
      
      if (error && !error.message.includes('already enabled')) {
        console.log(`⚠️ RLS enable for ${table}:`, error.message)
      } else {
        console.log(`✅ RLS enabled for ${table}`)
      }
    }
    
    console.log('\n🛡️ Creating permissive policies...')
    
    for (const policy of policies) {
      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql: policy.sql
        })
        
        if (error && !error.message.includes('already exists')) {
          console.log(`⚠️ Policy ${policy.policy}:`, error.message)
        } else {
          console.log(`✅ Policy created: ${policy.policy}`)
        }
      } catch (err) {
        console.log(`⚠️ Policy ${policy.policy}: ${err}`)
      }
    }
    
    console.log('\n✅ RLS policies setup complete!')
    
  } catch (error) {
    console.error('❌ RLS setup failed:', error)
  }
}

fixRLSPolicies()
