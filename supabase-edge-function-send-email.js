// Supabase Edge Function for Sending Emails
// This should be deployed as a Supabase Edge Function
// File: supabase/functions/send-email/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { to, subject, html, from } = await req.json()

        // Validate required fields
        if (!to || !subject || !html) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: to, subject, html' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Email service configuration (you can use any email service)
        const emailServiceUrl = Deno.env.get('EMAIL_SERVICE_URL') || 'https://api.resend.com/emails'
        const emailApiKey = Deno.env.get('EMAIL_API_KEY') || Deno.env.get('RESEND_API_KEY')

        if (!emailApiKey) {
            return new Response(
                JSON.stringify({ error: 'Email service not configured' }),
                {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // Prepare email data
        const emailData = {
            from: from || 'noreply@temple-admin.com',
            to: Array.isArray(to) ? to : [to],
            subject: subject,
            html: html
        }

        // Send email using external service (Resend, SendGrid, etc.)
        const emailResponse = await fetch(emailServiceUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${emailApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
        })

        const emailResult = await emailResponse.json()

        if (!emailResponse.ok) {
            console.error('Email service error:', emailResult)
            return new Response(
                JSON.stringify({
                    error: 'Failed to send email',
                    details: emailResult
                }),
                {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // Log successful email send
        console.log('Email sent successfully:', {
            to: emailData.to,
            subject: emailData.subject,
            messageId: emailResult.id
        })

        return new Response(
            JSON.stringify({
                success: true,
                messageId: emailResult.id,
                recipients: emailData.to.length
            }),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )

    } catch (error) {
        console.error('Error in send-email function:', error)

        return new Response(
            JSON.stringify({
                error: 'Internal server error',
                message: error.message
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})

/* 
DEPLOYMENT INSTRUCTIONS:

1. Install Supabase CLI:
   npm install -g supabase

2. Initialize Supabase in your project:
   supabase init

3. Create the edge function:
   supabase functions new send-email

4. Replace the content of supabase/functions/send-email/index.ts with this code

5. Deploy the function:
   supabase functions deploy send-email

6. Set environment variables in Supabase Dashboard:
   - EMAIL_API_KEY: Your email service API key (Resend, SendGrid, etc.)
   - EMAIL_SERVICE_URL: Your email service endpoint

7. Test the function:
   supabase functions invoke send-email --data '{"to":["test@example.com"],"subject":"Test","html":"<p>Test email</p>"}'

ALTERNATIVE EMAIL SERVICES:

For Resend (recommended):
- Sign up at https://resend.com
- Get API key
- Set EMAIL_SERVICE_URL=https://api.resend.com/emails
- Set EMAIL_API_KEY=your_resend_api_key

For SendGrid:
- Sign up at https://sendgrid.com
- Get API key  
- Set EMAIL_SERVICE_URL=https://api.sendgrid.com/v3/mail/send
- Set EMAIL_API_KEY=your_sendgrid_api_key
- Adjust the email data format accordingly

For SMTP (using nodemailer in a different edge function):
- Use SMTP credentials
- Create a separate edge function with nodemailer
*/