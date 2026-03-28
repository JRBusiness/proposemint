'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Sparkles, Copy, Check, Send, Mail, X } from 'lucide-react'

const steps = [
  { id: 1, title: 'Client Info', question: 'Who is this proposal for?', sub: 'Tell us about your client' },
  { id: 2, title: 'Project', question: 'What do they need?', sub: 'Describe the project in their words' },
  { id: 3, title: 'Scope', question: 'What will you deliver?', sub: 'Be specific about deliverables' },
  { id: 4, title: 'Timeline', question: 'When do they need it?', sub: 'Set realistic expectations' },
  { id: 5, title: 'Pricing', question: 'How much will it cost?', sub: 'Set your price and deposit' },
]

const depositOptions = [
  { value: '25', label: '25% deposit' },
  { value: '30', label: '30% deposit' },
  { value: '50', label: '50% deposit' },
]

function CustomSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  const [open, setOpen] = useState(false)
  const selected = options.find(o => o.value === value)

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/[0.07] text-lg transition-all">
        <span>{selected?.label}</span>
        <ArrowRight className={`w-5 h-5 text-white/50 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-2 py-2 rounded-xl border border-white/10 overflow-hidden" style={{ background: '#111' }}>
          {options.map(opt => (
            <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`w-full text-left px-4 py-2.5 text-lg transition-colors ${opt.value === value ? 'text-sky-400 bg-sky-500/10' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function EmailPreview({ proposal, clientName, clientEmail, clientCompany, price, deposit, depositAmount, onClose }: {
  proposal: string; clientName: string; clientEmail: string; clientCompany: string;
  price: number; deposit: string; depositAmount: number; onClose: () => void;
}) {
  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-sky-400" />
            <h1 className="text-xl font-bold">Email Preview</h1>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email header */}
        <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-white/30 mb-1">To:</p>
              <p className="text-white">{clientEmail || 'No email set'}</p>
            </div>
            <div>
              <p className="text-white/30 mb-1">Subject:</p>
              <p className="text-white">Project Proposal — {clientCompany || clientName}</p>
            </div>
            <div>
              <p className="text-white/30 mb-1">Value:</p>
              <p className="text-sky-400 font-bold">${Number(price).toLocaleString()} (${depositAmount.toLocaleString()} deposit)</p>
            </div>
          </div>
        </div>

        {/* Email body */}
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="p-6 bg-white/[0.02]" style={{ background: '#0d0d0d' }}>
            <p className="text-white/50 text-sm mb-4">Email body (copy and paste):</p>
            <div className="p-6 rounded-lg border border-white/10 bg-dark">
              <p className="text-white mb-6">Hi {clientName},</p>
              <div className="prose prose-invert prose-sm max-w-none text-white/80 whitespace-pre-wrap">
                {proposal}
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-white/80">Best regards,</p>
                <p className="text-white">[Your Name]</p>
                <p className="text-white/50 text-sm">[Your Email]</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button onClick={onClose}
            className="px-6 py-4 border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-medium rounded-xl transition-all flex-1">
            Back to Editor
          </button>
          <button
            className="px-6 py-4 bg-sky-500 hover:bg-sky-400 text-dark font-bold rounded-xl transition-all flex-1 flex items-center justify-center gap-2">
            <Send className="w-5 h-5" /> Open in Email Client
          </button>
        </div>
      </div>
    </div>
  )
}

export default function NewProposal() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    clientName: '', clientEmail: '', clientCompany: '',
    project: '', scope: '', timeline: '', price: '', deposit: '30'
  })
  const [proposal, setProposal] = useState('')
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showEmailPreview, setShowEmailPreview] = useState(false)
  const router = useRouter()

  const depositAmount = form.price ? Math.round(Number(form.price) * Number(form.deposit) / 100) : 0
  const inputClass = 'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-sky-500/50 text-lg transition-all'

  const handleGenerate = async () => {
    if (!form.clientName || !form.project || !form.price) return
    setGenerating(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: form.clientName,
          clientCompany: form.clientCompany,
          projectDescription: form.project,
          scope: form.scope,
          timeline: form.timeline,
          price: Number(form.price),
          depositPercent: Number(form.deposit)
        })
      })
      const data = await res.json()
      if (data.proposalText) {
        setProposal(data.proposalText)
      } else {
        alert(data.error || 'Failed to generate')
      }
    } catch {
      alert('Something went wrong')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(proposal)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Show email preview
  if (showEmailPreview) {
    return (
      <EmailPreview
        proposal={proposal}
        clientName={form.clientName}
        clientEmail={form.clientEmail}
        clientCompany={form.clientCompany}
        price={Number(form.price)}
        deposit={form.deposit}
        depositAmount={depositAmount}
        onClose={() => setShowEmailPreview(false)}
      />
    )
  }

  // Show generated proposal
  if (proposal) {
    return (
      <div className="min-h-screen bg-dark">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Proposal Ready</h1>
              <p className="text-white/50 text-sm">Copy and paste into Upwork, Fiverr, or any platform</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-white/70">Your Proposal</label>
              <button onClick={handleCopy}
                className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy to clipboard'}
              </button>
            </div>
            <div className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10">
              <pre className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap font-sans">{proposal}</pre>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center">
              <p className="text-white/30 text-xs mb-1">Project Value</p>
              <p className="text-xl font-bold text-white">${Number(form.price).toLocaleString()}</p>
            </div>
            <div className="flex-1 p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center">
              <p className="text-white/30 text-xs mb-1">Deposit ({form.deposit}%)</p>
              <p className="text-xl font-bold text-sky-400">${depositAmount.toLocaleString()}</p>
            </div>
            <div className="flex-1 p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center">
              <p className="text-white/30 text-xs mb-1">Client</p>
              <p className="text-lg font-bold text-white truncate">{form.clientName}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setProposal('')}
              className="px-6 py-4 border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-medium rounded-xl transition-all flex-1">
              Edit / Regenerate
            </button>
            <button onClick={() => setShowEmailPreview(true)}
              className="px-6 py-4 bg-sky-500 hover:bg-sky-400 text-dark font-bold rounded-xl transition-all flex-1 flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" /> Preview as Email
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Wizard steps
  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <button onClick={() => step === 1 ? router.push('/dashboard') : setStep(step - 1)}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> {step === 1 ? 'Back to dashboard' : 'Back'}
        </button>
        <h1 className="text-3xl font-black">New Proposal</h1>
        <p className="text-white/50 mt-1">Step {step} of {steps.length} — {steps[step-1].sub}</p>

        <div className="flex gap-2 mb-12 mt-6">
          {steps.map(s => (
            <div key={s.id} className={'h-1 flex-1 rounded-full transition-all ' + (s.id <= step ? 'bg-sky-500' : 'bg-white/10')} />
          ))}
        </div>

        <div className="mb-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">{steps[0].question}</h2>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Client Name *</label>
                <input value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} placeholder="Jane Smith" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Client Email</label>
                <input value={form.clientEmail} onChange={e => setForm({...form, clientEmail: e.target.value})} placeholder="jane@company.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Company (optional)</label>
                <input value={form.clientCompany} onChange={e => setForm({...form, clientCompany: e.target.value})} placeholder="Acme Corp" className={inputClass} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">{steps[1].question}</h2>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Describe what your client needs *</label>
                <textarea value={form.project} onChange={e => setForm({...form, project: e.target.value})} rows={5}
                  placeholder="They need a complete website redesign for their consulting business..."
                  className={inputClass + ' resize-none'} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">{steps[2].question}</h2>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">What will you deliver? Be specific.</label>
                <textarea value={form.scope} onChange={e => setForm({...form, scope: e.target.value})} rows={5}
                  placeholder="Discovery phase: 3 stakeholder interviews, competitive analysis... Design: 3 homepage concepts..."
                  className={inputClass + ' resize-none'} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">{steps[3].question}</h2>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Project timeline and milestones</label>
                <textarea value={form.timeline} onChange={e => setForm({...form, timeline: e.target.value})} rows={5}
                  placeholder="Week 1-2: Discovery and wireframes&#10;Week 3-5: Design phase&#10;Week 6-8: Development&#10;Week 9: Launch"
                  className={inputClass + ' resize-none'} />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">{steps[4].question}</h2>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Total project price (USD) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-lg">$</span>
                  <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="5000"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-sky-500/50 text-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Deposit percentage</label>
                <CustomSelect value={form.deposit} onChange={v => setForm({...form, deposit: v})} options={depositOptions} />
                {form.price && <p className="text-sky-400 mt-2 text-sm">Deposit amount: ${depositAmount.toLocaleString()}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button onClick={() => step === 1 ? router.push('/dashboard') : setStep(step - 1)}
            className="px-6 py-4 border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-medium rounded-xl transition-all flex-1">
            Back
          </button>
          {step < 5 ? (
            <button onClick={() => setStep(step + 1)}
              className="px-6 py-4 bg-sky-500 hover:bg-sky-400 text-dark font-bold rounded-xl transition-all flex-1 flex items-center justify-center gap-2">
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={handleGenerate} disabled={generating || !form.clientName || !form.project || !form.price}
              className="px-6 py-4 bg-sky-500 hover:bg-sky-400 disabled:bg-sky-500/50 disabled:cursor-not-allowed text-dark font-bold rounded-xl transition-all flex-1 flex items-center justify-center gap-2">
              {generating ? (<><Sparkles className="w-5 h-5 animate-pulse" /> Generating...</>) : 'Generate Proposal'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
