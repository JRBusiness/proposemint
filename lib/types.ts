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

export interface Database {
  public: {
    Tables: {
      proposals: {
        Row: Proposal
        Insert: Omit<Proposal, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Proposal, 'id' | 'created_at'>>
      }
    }
  }
}
