-- Create Email Communications Tables for Supabase
-- Run this in Supabase Dashboard → SQL Editor

-- =============================================
-- EMAIL COMMUNICATIONS TABLE
-- =============================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS public.email_communications CASCADE;

-- Create email communications table
CREATE TABLE public.email_communications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid,
  sender_email text NOT NULL,
  recipient_emails text[] NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  template_id uuid,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  scheduled_at timestamp with time zone,
  sent_at timestamp with time zone,
  delivery_status jsonb,
  recipient_count integer DEFAULT 0,
  opened_count integer DEFAULT 0,
  clicked_count integer DEFAULT 0,
  failed_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT email_communications_pkey PRIMARY KEY (id),
  CONSTRAINT email_communications_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE
);

-- =============================================
-- EMAIL TEMPLATES TABLE
-- =============================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS public.email_templates CASCADE;

-- Create email templates table
CREATE TABLE public.email_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid,
  name text NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'general' CHECK (category IN ('general', 'announcement', 'event', 'volunteer', 'donation', 'newsletter')),
  variables jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  usage_count integer DEFAULT 0,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT email_templates_pkey PRIMARY KEY (id),
  CONSTRAINT email_templates_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE
);

-- =============================================
-- EMAIL RECIPIENTS TABLE (for tracking individual sends)
-- =============================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS public.email_recipients CASCADE;

-- Create email recipients table for detailed tracking
CREATE TABLE public.email_recipients (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email_communication_id uuid NOT NULL,
  recipient_email text NOT NULL,
  recipient_name text,
  recipient_type text DEFAULT 'user' CHECK (recipient_type IN ('user', 'volunteer', 'member', 'donor')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
  sent_at timestamp with time zone,
  delivered_at timestamp with time zone,
  opened_at timestamp with time zone,
  clicked_at timestamp with time zone,
  error_message text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT email_recipients_pkey PRIMARY KEY (id),
  CONSTRAINT email_recipients_email_communication_id_fkey FOREIGN KEY (email_communication_id) REFERENCES public.email_communications(id) ON DELETE CASCADE,
  CONSTRAINT email_recipients_unique UNIQUE (email_communication_id, recipient_email)
);

-- =============================================
-- ENABLE RLS AND CREATE POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.email_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_recipients ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development (adjust for production)
CREATE POLICY "allow_all_email_communications" ON public.email_communications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_email_templates" ON public.email_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_email_recipients" ON public.email_recipients FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- Email communications indexes
CREATE INDEX idx_email_communications_community_id ON public.email_communications(community_id);
CREATE INDEX idx_email_communications_status ON public.email_communications(status);
CREATE INDEX idx_email_communications_sent_at ON public.email_communications(sent_at);
CREATE INDEX idx_email_communications_created_at ON public.email_communications(created_at);

-- Email templates indexes
CREATE INDEX idx_email_templates_community_id ON public.email_templates(community_id);
CREATE INDEX idx_email_templates_category ON public.email_templates(category);
CREATE INDEX idx_email_templates_is_active ON public.email_templates(is_active);

-- Email recipients indexes
CREATE INDEX idx_email_recipients_email_communication_id ON public.email_recipients(email_communication_id);
CREATE INDEX idx_email_recipients_status ON public.email_recipients(status);
CREATE INDEX idx_email_recipients_recipient_email ON public.email_recipients(recipient_email);

-- =============================================
-- CREATE TRIGGERS FOR UPDATED_AT
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_email_communications_updated_at
    BEFORE UPDATE ON public.email_communications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at
    BEFORE UPDATE ON public.email_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_recipients_updated_at
    BEFORE UPDATE ON public.email_recipients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INSERT SAMPLE EMAIL TEMPLATES
-- =============================================

-- Insert sample email templates
INSERT INTO public.email_templates (
  name,
  subject,
  content,
  category,
  variables
) VALUES 
(
  'Welcome Email',
  'Welcome to {{community_name}}!',
  '<h1>Welcome {{name}}!</h1><p>We are excited to have you join our temple community. Here are some important details to get you started...</p>',
  'general',
  '["name", "community_name"]'::jsonb
),
(
  'Event Announcement',
  'Upcoming Event: {{event_name}}',
  '<h2>{{event_name}}</h2><p>Dear {{name}},</p><p>We are pleased to announce our upcoming event:</p><p><strong>Date:</strong> {{event_date}}<br><strong>Time:</strong> {{event_time}}<br><strong>Location:</strong> {{event_location}}</p>',
  'event',
  '["name", "event_name", "event_date", "event_time", "event_location"]'::jsonb
),
(
  'Volunteer Reminder',
  'Volunteer Shift Reminder - {{shift_name}}',
  '<h2>Volunteer Shift Reminder</h2><p>Dear {{name}},</p><p>This is a friendly reminder about your upcoming volunteer shift:</p><p><strong>Shift:</strong> {{shift_name}}<br><strong>Date:</strong> {{shift_date}}<br><strong>Time:</strong> {{shift_time}}</p>',
  'volunteer',
  '["name", "shift_name", "shift_date", "shift_time"]'::jsonb
);

-- =============================================
-- VERIFY TABLES CREATION
-- =============================================

-- Verify tables were created successfully
SELECT 'Email communications tables created successfully!' as message;

SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('email_communications', 'email_templates', 'email_recipients')
ORDER BY table_name, ordinal_position;

-- Check sample templates
SELECT COUNT(*) as template_count FROM public.email_templates;