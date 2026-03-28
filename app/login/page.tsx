'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => router.push('/dashboard'), 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center font-bold text-dark text-sm">P</div>
            <span className="font-bold text-xl">ProposeMint</span>
          </Link>
          <h1 className="text-3xl font-black">Welcome back</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@company.com"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-sky-500/50 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Your password"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-sky-500/50 transition-all" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-4 bg-sky-500 hover:bg-sky-400 disabled:bg-sky-500/50 text-dark font-bold rounded-xl transition-all text-lg cursor-pointer">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-white/30 text-sm mt-6">
          New to ProposeMint? <Link href="/signup" className="text-sky-400 hover:text-sky-300">Create account</Link>
        </p>
      </div>
    </div>
  )
}
