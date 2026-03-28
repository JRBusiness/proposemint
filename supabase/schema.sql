-- ProposeMint Database Schema
-- Run this in your Supabase SQL Editor

-- Create proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_company TEXT,
  project_description TEXT NOT NULL,
  scope TEXT,
  timeline TEXT,
  price NUMERIC NOT NULL,
  deposit_percent NUMERIC NOT NULL DEFAULT 30,
  deposit_amount NUMERIC,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'approved')),
  proposal_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own proposals
CREATE POLICY "Users can view own proposals" ON proposals
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own proposals
CREATE POLICY "Users can insert own proposals" ON proposals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own proposals
CREATE POLICY "Users can update own proposals" ON proposals
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own proposals
CREATE POLICY "Users can delete own proposals" ON proposals
  FOR DELETE USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
