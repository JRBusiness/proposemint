import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient(supabaseUrl, supabaseAnonKey) as any

export interface Proposal {
  id: string
  user_id: string
  client_name: string
  client_email: string
  client_company: string
  project_description: string
  scope: string
  timeline: string
  price: number
  deposit_percent: number
  deposit_amount: number
  status: 'draft' | 'sent' | 'viewed' | 'approved'
  proposal_text: string
  created_at: string
  updated_at: string
}
