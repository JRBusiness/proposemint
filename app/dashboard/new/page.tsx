'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'

const steps = [
  { id: 1, title: 'Client Info', question: 'Who is this proposal for?', sub: 'Tell us about your client' },
  { id: 2, title: 'Project', question: 'What do they need?', sub: 'Describe the project in their words' },
  { id: 3, title: 'Scope', question: 'What will you deliver?', sub: 'Be specific about deliverables' },
  { id: 4, title: 'Timeline', question: 'When do they need it?', sub: 'Set realistic expectations' },
  { id: 5, title: 'Pricing', question: 'How much will it cost?', sub: 'Set your price and deposit' },
]

export default function NewProposal() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    clientName: '', clientEmail: '', clientCompany: '',
    project: '', scope: '', timeline: '', price: '', deposit: '30'
  })
  const [generating, setGenerating] = useState(false)
  const router = useRouter()

  const handleNext = () => { if (step < 5) setStep(step + 1); else handleSubmit() }
  const handleBack = () => { if (step > 1) setStep(step - 1); else router.push('/dashboard') }

  const handleSubmit = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2000))
    router.push('/dashboard')
  }

  const depositAmount = form.price ? Math.round(Number(form.price) * Number(form.deposit) / 100) : 0

  const inputClass = 'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-sky-500/50 text-lg transition-all'

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <button onClick={handleBack} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
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
                <label className="block text-sm font-medium text-white/70 mb-2">Client Name</label>
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
                <label className="block text-sm font-medium text-white/70 mb-2">Describe what your client needs</label>
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
                  placeholder="Week 1-2: Discovery and wireframes&#10;Week 3-5: Design phase&#10;Week 6-8: Development&#10;Week 9: Launch and training"
                  className={inputClass + ' resize-none'} />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">{steps[4].question}</h2>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Total project price (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-lg">$</span>
                  <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="5000"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-sky-500/50 text-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Deposit percentage to secure the project</label>
                <select value={form.deposit} onChange={e => setForm({...form, deposit: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-sky-500/50 text-lg [&>option]:bg-dark">
                  <option value="25">25% deposit</option>
                  <option value="30">30% deposit</option>
                  <option value="50">50% deposit</option>
                </select>
                {form.price && <p className="text-sky-400 mt-2 text-sm">Deposit amount: ${depositAmount.toLocaleString()}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button onClick={handleBack}
            className="px-6 py-4 border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-medium rounded-xl transition-all flex-1">
            Back
          </button>
          <button onClick={handleNext}
            className="px-6 py-4 bg-sky-500 hover:bg-sky-400 text-dark font-bold rounded-xl transition-all flex-1 flex items-center justify-center gap-2">
            {step === 5 ? (
              generating ? (<><Sparkles className="w-5 h-5 animate-pulse" /> Generating...</>) : 'Generate Proposal'
            ) : (<>Continue <ArrowRight className="w-5 h-5" /></>)}
          </button>
        </div>
      </div>
    </div>
  )
}
