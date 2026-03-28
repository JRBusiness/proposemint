'use client'

import Link from 'next/link'
import { Plus, FileText, Eye, MoreVertical } from 'lucide-react'

const demoProposals = [
  { id: '1', client: 'Acme Corp', title: 'Website Redesign', status: 'sent', viewed: true, amount: 4500, created: '2 days ago' },
  { id: '2', client: 'Sarah Johnson', title: 'Brand Identity', status: 'viewed', viewed: true, amount: 2200, created: '5 days ago' },
  { id: '3', client: 'TechStart Inc', title: 'App Development', status: 'draft', viewed: false, amount: 8500, created: '1 week ago' },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-dark">
      <nav className="border-b border-white/5 bg-dark/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center font-bold text-dark text-sm">P</div>
            <span className="font-bold text-xl">ProposeMint</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/50">Free Plan</span>
            <button className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-dark text-sm font-bold rounded-lg transition-colors">Upgrade</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Proposals</h1>
            <p className="text-white/50 mt-1">3 of 3 free proposals remaining</p>
          </div>
          <Link href="/dashboard/new" className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-400 text-dark font-bold rounded-xl transition-all hover:scale-105">
            <Plus className="w-5 h-5" />
            New Proposal
          </Link>
        </div>

        <div className="space-y-4">
          {demoProposals.map((proposal) => (
            <div key={proposal.id} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{proposal.title}</h3>
                    <p className="text-white/50 text-sm">{proposal.client} · {proposal.created}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold text-lg">${proposal.amount.toLocaleString()}</p>
                    <p className="text-white/50 text-sm">${Math.round(proposal.amount * 0.3).toLocaleString()} deposit</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {proposal.status === 'draft' && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/70">Draft</span>
                    )}
                    {proposal.status === 'sent' && !proposal.viewed && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-500/20 text-sky-400">Sent</span>
                    )}
                    {proposal.viewed && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Viewed
                      </span>
                    )}
                  </div>
                  <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
