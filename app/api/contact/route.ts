import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema } from '../../../lib/validations/schemas'
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
    const validatedData = contactFormSchema.parse(body)

    // Store contact message in database (optional)
    const supabaseClient = getSupabaseClient()
    if (supabaseClient) {
      try {
        const { error: dbError } = await supabaseClient
          .from('contact_messages')
          .insert([{
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone || null,
            message: validatedData.message,
            status: 'new',
            created_at: new Date().toISOString()
          }])

        if (dbError) {
          console.error('Database error:', dbError)
          // Continue even if database insert fails
        }
      } catch (dbError) {
        console.error('Failed to store contact message:', dbError)
        // Continue even if database insert fails
      }
    }

    // Log the contact form submission
    console.log('Contact form submission:', {
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      messageLength: validatedData.message.length,
      timestamp: new Date().toISOString()
    })

    // TODO: Send email notification
    // In production, integrate with email service (SendGrid, Resend, etc.)
    // await sendContactEmail({
    //   to: process.env.BUSINESS_EMAIL || 'info@healthycorner.si',
    //   subject: `New Contact Form Message from ${validatedData.name}`,
    //   html: generateContactEmailTemplate(validatedData)
    // })

    // TODO: Send auto-reply to user
    // await sendAutoReply({
    //   to: validatedData.email,
    //   name: validatedData.name
    // })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error processing contact form:', error)

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
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}

// Helper function to generate email template (for future use)
function generateContactEmailTemplate(data: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #84cc16;">New Contact Form Message</h2>
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
        <p><strong>Message:</strong></p>
        <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
          ${data.message.replace(/\n/g, '<br>')}
        </div>
      </div>
      <p style="color: #6b7280; font-size: 14px;">
        This message was sent from the Healthy Corner contact form.
      </p>
    </div>
  `
}
