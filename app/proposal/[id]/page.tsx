'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Copy, Check, Mail, Edit, Trash2, Send } from 'lucide-react'
import { useAuth } from '../../components/AuthProvider'
import { supabase } from '@/lib/supabase'
import type { Proposal } from '@/lib/types'

export default function ProposalDetail() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const id = params.id as string

  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [copied, setCopied] = useState(false)
  const [showEmailPreview, setShowEmailPreview] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && id) {
      loadProposal()
    }
  }, [user, id])

  const loadProposal = async () => {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      setProposal(null)
    } else {
      setProposal(data)
    }
    setLoading(false)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <p className="text-white/50">Loading...</p>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center">
        <p className="text-white/50 mb-4">Proposal not found</p>
        <Link href="/dashboard" className="text-sky-400 hover:text-sky-300">Back to Dashboard</Link>
      </div>
    )
  }

  const depositAmount = proposal.deposit_amount || Math.round(proposal.price * (proposal.deposit_percent / 100))
  const statusColors: Record<string, string> = {
    draft: 'bg-white/10 text-white/70',
    sent: 'bg-sky-500/20 text-sky-400',
    viewed: 'bg-green-500/20 text-green-400',
    approved: 'bg-green-500/20 text-green-400',
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(proposal.proposal_text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    if (!confirm('Delete this proposal? This cannot be undone.')) return
    await supabase.from('proposals').delete().eq('id', id)
    router.push('/dashboard')
  }

  const handleSend = () => {
    const subject = encodeURIComponent(`Project Proposal — ${proposal.client_company || proposal.client_name}`)
    const body = encodeURIComponent(`Hi ${proposal.client_name},\n\nPlease find my proposal below.\n\n${proposal.proposal_text}\n\nBest regards`)
    window.open(`mailto:${proposal.client_email || ''}?subject=${subject}&body=${body}`, '_blank')
  }

  const statusLabel: Record<string, string> = {
    draft: 'Draft',
    sent: 'Sent',
    viewed: 'Viewed',
    approved: 'Approved',
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard"
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black">{proposal.client_company || proposal.client_name}</h1>
              <p className="text-white/50 text-sm">
                {new Date(proposal.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[proposal.status] || statusColors.draft}`}>
            {statusLabel[proposal.status] || 'Draft'}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <p className="text-white/30 text-xs mb-1">Project Value</p>
            <p className="text-xl font-bold">${proposal.price.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <p className="text-white/30 text-xs mb-1">Deposit ({proposal.deposit_percent}%)</p>
            <p className="text-xl font-bold text-sky-400">${depositAmount.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <p className="text-white/30 text-xs mb-1">Client</p>
            <p className="text-lg font-bold truncate">{proposal.client_name}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-8">
          <button onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-medium transition-all">
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Proposal'}
          </button>
          {proposal.client_email && (
            <button onClick={handleSend}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-dark font-bold transition-all">
              <Send className="w-4 h-4" /> Send via Email
            </button>
          )}
        </div>

        {/* Proposal content */}
        <div className="mb-8">
          <label className="text-sm font-medium text-white/70 mb-3 block">Proposal Content</label>
          <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
            <pre className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap font-sans">{proposal.proposal_text}</pre>
          </div>
        </div>

        {/* Client info */}
        <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
          <h3 className="font-bold mb-4">Client Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white/30 mb-1">Name</p>
              <p className="text-white">{proposal.client_name}</p>
            </div>
            {proposal.client_email && (
              <div>
                <p className="text-white/30 mb-1">Email</p>
                <p className="text-white">{proposal.client_email}</p>
              </div>
            )}
            {proposal.client_company && (
              <div>
                <p className="text-white/30 mb-1">Company</p>
                <p className="text-white">{proposal.client_company}</p>
              </div>
            )}
          </div>
        </div>

        {/* Danger zone */}
        <div className="mt-8 pt-8 border-t border-white/5">
          <button onClick={handleDelete}
            className="flex items-center gap-2 text-red-400/60 hover:text-red-400 text-sm transition-colors">
            <Trash2 className="w-4 h-4" /> Delete proposal
          </button>
        </div>
      </div>
    </div>
  )
}
