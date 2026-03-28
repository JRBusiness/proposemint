# ProposeMint

AI-powered proposal generator for freelancers. Answer 5 questions → get a professional proposal.

## Setup

### 1. Clone and Install
```bash
npm install
```

### 2. Supabase Setup (Required for Auth + Database)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key
3. Go to **SQL Editor** in your Supabase dashboard
4. Run the schema from `supabase/schema.sql`
5. Add to Vercel environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key

### 3. MiniMax AI Setup (Required for Proposal Generation)

1. Sign up at [platform.minimax.io](https://platform.minimax.io)
2. Get your API key
3. Add to Vercel environment variables:
   - `MINIMAX_API_KEY` = your MiniMax API key

### 4. Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy

### 5. Update Vercel Environment Variables

Make sure these are set in Vercel dashboard → Settings → Environment Variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase |
| `MINIMAX_API_KEY` | From MiniMax |

## Features

- 5-step wizard to create proposals
- AI-generated proposal text using MiniMax
- Copy/paste for Upwork, Fiverr, etc.
- Email preview with one-click send
- Persistent storage (Supabase)
- User authentication

## Tech Stack

- Next.js 14
- Tailwind CSS
- Supabase (auth + database)
- MiniMax AI
- Stripe (future payments)
