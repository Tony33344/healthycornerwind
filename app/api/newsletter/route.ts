import { NextRequest, NextResponse } from 'next/server'
import { newsletterSchema } from '../../../lib/validations/schemas'
import { supabase } from '../../../lib/supabase/client'

// Helper function to get Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return null
  }
  
  return supabase
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input using Zod schema
    const validatedData = newsletterSchema.parse(body)
    const { email } = validatedData

    const supabaseClient = getSupabaseClient()
    if (!supabaseClient) {
      return NextResponse.json(
        { error: 'Database configuration required' },
        { status: 500 }
      )
    }

    // Check if already subscribed
    const { data: existing } = await supabaseClient
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email)
      .single()

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { 
            success: false,
            error: 'Email already subscribed',
            message: 'This email is already subscribed to our newsletter'
          },
          { status: 409 }
        )
      } else {
        // Reactivate subscription (columns: email, status, subscribed_at, unsubscribed_at)
        const { data, error } = await supabaseClient
          .from('newsletter_subscribers')
          .update({ 
            status: 'active', 
            unsubscribed_at: null,
          })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) {
          console.error('Database error reactivating subscription:', error)
          throw error
        }

        return NextResponse.json(
          { 
            success: true, 
            message: 'Subscription reactivated successfully',
            timestamp: new Date().toISOString()
          },
          { status: 200 }
        )
      }
    }

    // Create new subscription
    const { data, error } = await supabaseClient
      .from('newsletter_subscribers')
      .insert([{ 
        email, 
        status: 'active',
        subscribed_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) {
      console.error('Database error creating subscription:', error)
      throw error
    }

    // Log successful subscription
    console.log('Newsletter subscription:', {
      email,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully subscribed to newsletter',
        timestamp: new Date().toISOString()
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error subscribing to newsletter:', error)

    // Handle Zod validation errors
    if (error && typeof error === 'object' && 'issues' in error) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.issues?.map((issue: any) => ({
            field: issue.path?.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      )
    }

    // Handle other errors
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailValidation = newsletterSchema.safeParse({ email })
    if (!emailValidation.success) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const supabaseClient = getSupabaseClient()
    if (!supabaseClient) {
      return NextResponse.json(
        { error: 'Database configuration required' },
        { status: 500 }
      )
    }

    const { data, error } = await supabaseClient
      .from('newsletter_subscribers')
      .update({ 
        status: 'unsubscribed', 
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('email', email)
      .select()
      .single()

    if (error) {
      console.error('Database error unsubscribing:', error)
      throw error
    }

    // Log unsubscription
    console.log('Newsletter unsubscription:', {
      email,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully unsubscribed from newsletter',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe. Please try again later.' },
      { status: 500 }
    )
  }
}
