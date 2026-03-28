export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-dark/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center font-bold text-dark text-sm">P</div>
            <span className="font-bold text-xl tracking-tight">ProposeMint</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm text-white/60 hover:text-white transition-colors">Login</a>
            <a href="/signup" className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-dark text-sm font-bold rounded-lg transition-colors">Start Free</a>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sky-500/20 bg-sky-500/10 text-sky-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            Now in Early Access
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
            Proposals That <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Get Approved</span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop wasting hours writing proposals. Answer 5 questions. Get a professional, payment-enabled proposal. Close more clients, faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-dark font-bold rounded-xl transition-all hover:scale-105 text-lg">
              Create Free Proposal
            </a>
            <a href="#how" className="px-8 py-4 border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-medium rounded-xl transition-all">
              See How It Works
            </a>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sky-400 text-sm font-semibold uppercase tracking-widest mb-3">The Problem</p>
            <h2 className="text-3xl md:text-5xl font-bold">Proposals Are Broken</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: '⏰', title: 'Hours Wasted', desc: 'You spend 3+ hours crafting each proposal. That is time you could spend on actual client work.' },
              { emoji: '😰', title: 'Amateur Look', desc: 'You are a great designer/developer/marketer. But your proposals look like Word docs from 2005.' },
              { emoji: '💸', title: 'No Payments', desc: 'Client loves the proposal but goes silent. You never collected a deposit. No skin in their game.' }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sky-400 text-sm font-semibold uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-3xl md:text-5xl font-bold">Three Steps to Your Next Yes</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Answer 5 Questions', desc: 'Tell us about your client and what they need. Takes about 3 minutes.' },
              { num: '02', title: 'AI Generates Proposal', desc: 'Our AI crafts a professional proposal with scope, timeline, and pricing.' },
              { num: '03', title: 'Send & Get Paid', desc: 'Share your proposal link. Client approves and pays deposit in one click.' }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-black text-sky-500/10 mb-4">{step.num}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-white/40 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6 border-t border-white/5 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to close more clients?</h2>
          <p className="text-white/40 text-lg mb-10">3 free proposals. No credit card required.</p>
          <a href="/signup" className="inline-block px-10 py-5 bg-sky-500 hover:bg-sky-400 text-dark font-bold rounded-xl text-lg transition-all hover:scale-105">
            Create Your Free Account
          </a>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-white/5 text-center text-white/30 text-sm">
        <p>ProposeMint — Proposals That Convert</p>
      </footer>
    </main>
  )
}
