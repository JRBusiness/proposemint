'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, FileText, Eye, MoreVertical, Trash2, Copy, Send, LogOut, User } from 'lucide-react'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '@/lib/supabase'
import type { Proposal } from '@/lib/types'

function ProposalMenu({ proposal, onDelete, onView }: { proposal: Proposal; onDelete: () => void; onView: () => void }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleClick = () => setOpen(false)
    if (open) {
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [open])

  const handleCopy = () => {
    navigator.clipboard.writeText(proposal.proposal_text)
    setOpen(false)
  }

  const handleSend = () => {
    const subject = encodeURIComponent(`Project Proposal — ${proposal.client_company || proposal.client_name}`)
    const body = encodeURIComponent(`Hi ${proposal.client_name},\n\nPlease find my proposal below.\n\n${proposal.proposal_text}\n\nBest regards`)
    window.open(`mailto:${proposal.client_email || ''}?subject=${subject}&body=${body}`, '_blank')
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
      >
        <MoreVertical className="w-5 h-5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 py-2 rounded-xl border border-white/10 overflow-hidden z-50" style={{ background: '#111' }}>
          <button
            onClick={() => { onView(); setOpen(false) }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Eye className="w-4 h-4" /> View Details
          </button>
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Copy className="w-4 h-4" /> Copy Proposal
          </button>
          {proposal.client_email && (
            <button
              onClick={handleSend}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Send className="w-4 h-4" /> Send via Email
            </button>
          )}
          <div className="my-1 border-t border-white/5" />
          <button
            onClick={() => { onDelete(); setOpen(false) }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadProposals()
    }
  }, [user])

  const loadProposals = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setProposals(data)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this proposal?')) return
    await supabase.from('proposals').delete().eq('id', id)
    setProposals(proposals.filter(p => p.id !== id))
  }

  const getStatusBadge = (proposal: Proposal) => {
    if (proposal.status === 'draft') {
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/70">Draft</span>
    }
    if (proposal.status === 'viewed' || proposal.status === 'approved') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 flex items-center gap-1">
          <Eye className="w-3 h-3" /> {proposal.status === 'approved' ? 'Approved' : 'Viewed'}
        </span>
      )
    }
    if (proposal.status === 'sent') {
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-500/20 text-sky-400">Sent</span>
    }
    return null
  }

  const depositAmount = (proposal: Proposal) => {
    return proposal.deposit_amount || Math.round(proposal.price * (proposal.deposit_percent / 100))
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <p className="text-white/50">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-dark">
      <nav className="border-b border-white/5 bg-dark/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center font-bold text-dark text-sm">P</div>
            <span className="font-bold text-xl">ProposeMint</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-white/50">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{user.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-dark text-sm font-bold rounded-lg transition-colors">Upgrade</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Proposals</h1>
            <p className="text-white/50 mt-1">
              {proposals.length === 0 ? 'No proposals yet' : `${proposals.length} proposal${proposals.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <Link href="/dashboard/new"
            className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-400 text-dark font-bold rounded-xl transition-all hover:scale-105">
            <Plus className="w-5 h-5" /> New Proposal
          </Link>
        </div>

        {proposals.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No proposals yet</h3>
            <p className="text-white/50 mb-6">Create your first proposal in under 5 minutes</p>
            <Link href="/dashboard/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-400 text-dark font-bold rounded-xl transition-all">
              <Plus className="w-5 h-5" /> Create First Proposal
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                onClick={() => router.push(`/proposal/${proposal.id}`)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-sky-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{proposal.client_company || proposal.client_name}</h3>
                      <p className="text-white/50 text-sm">
                        {proposal.client_company ? `${proposal.client_name} · ` : ''}
                        {new Date(proposal.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="font-bold text-lg">${proposal.price.toLocaleString()}</p>
                      <p className="text-white/50 text-sm">${depositAmount(proposal).toLocaleString()} deposit</p>
                    </div>
                    {getStatusBadge(proposal)}
                    <ProposalMenu proposal={proposal} onDelete={() => handleDelete(proposal.id)} onView={() => router.push(`/proposal/${proposal.id}`)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
