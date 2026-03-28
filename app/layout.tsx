import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ProposeMint — AI-Powered Proposals for Freelancers',
  description: 'Generate professional proposals in minutes. Answer 5 questions, get a stunning proposal with embedded payment.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-dark">{children}</body>
    </html>
  )
}
