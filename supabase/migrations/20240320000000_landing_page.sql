-- Create landing page content table
CREATE TABLE IF NOT EXISTS "public"."landing_page_content" (
  "id" serial PRIMARY KEY,
  "title" text NOT NULL,
  "subtitle" text NOT NULL,
  "description" text NOT NULL,
  "cta_text" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Create leads table for storing leads from landing pages
CREATE TABLE IF NOT EXISTS "public"."leads" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "phone" text,
  "source" text DEFAULT 'landing_page',
  "notes" text,
  "converted" boolean DEFAULT false,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Create index on leads email for faster searches
CREATE INDEX IF NOT EXISTS "leads_email_idx" ON "public"."leads" ("email");

-- Add RLS policies
ALTER TABLE "public"."landing_page_content" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."leads" ENABLE ROW LEVEL SECURITY;

-- Policies for landing_page_content
CREATE POLICY "Enable read access for all users" ON "public"."landing_page_content"
  FOR SELECT USING (true);

CREATE POLICY "Enable insert/update for authenticated users only" ON "public"."landing_page_content"
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policies for leads
CREATE POLICY "Enable read access for authenticated users only" ON "public"."leads"
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for everyone" ON "public"."leads"
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON "public"."leads"
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Default landing page content
INSERT INTO "public"."landing_page_content" 
  ("title", "subtitle", "description", "cta_text") 
VALUES 
  (
    'Laundry Service - We Make Laundry Simple', 
    'Professional laundry service, delivered to your door', 
    'Let us handle your laundry so you can focus on what matters most. Sign up today for exclusive offers!', 
    'Sign Up Now'
  )
ON CONFLICT (id) DO NOTHING; 