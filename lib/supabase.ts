import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper to get the current user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Sign up with email
export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password })
}

// Sign in with email
export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

// Sign out
export async function signOut() {
  return supabase.auth.signOut()
}
