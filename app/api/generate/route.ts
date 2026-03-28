import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: Request) {
  try {
    const { clientName, clientCompany, projectDescription, scope, timeline, price, depositPercent } = await request.json()

    const apiKey = process.env.MINIMAX_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'MINIMAX_API_KEY not configured' }, { status: 500 })
    }

    const minimax = new OpenAI({
      apiKey,
      baseURL: 'https://api.minimax.io/v1',
    })

    const depositAmount = Math.round(price * (depositPercent / 100))
    const companyContext = clientCompany ? ` at ${clientCompany}` : ''

    const prompt = `Write a professional freelance project proposal. Write it as a formal project proposal document — NOT as an email. No greeting like "Dear..." or sign-off like "Best regards". Just pure proposal content that can be copied and pasted into Upwork, Fiverr, or any freelance platform.

CLIENT: ${clientName}${companyContext}
PROJECT NEEDS: ${projectDescription}
SCOPE OF WORK: ${scope}
TIMELINE: ${timeline}
PROJECT PRICE: $${price.toLocaleString()}
DEPOSIT REQUIRED: $${depositAmount.toLocaleString()} (${depositPercent}%)

Format it as a clean proposal with these sections:
1. Project Overview
2. Scope of Work
3. Timeline & Milestones
4. Investment
5. Next Steps

Use **bold** for section titles and key terms. Keep it concise, professional, and persuasive. No email formatting.`

    const response = await minimax.chat.completions.create({
      model: 'MiniMax-M2',
      messages: [
        {
          role: 'system',
          content: 'You are ProposeMint, an expert freelance proposal writer. You write clean, professional proposals optimized for freelance platforms like Upwork and Fiverr. No email formatting — just pure proposal content with proper markdown-style sections and bold headers.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const proposalText = response.choices[0]?.message?.content || ''

    return NextResponse.json({ success: true, proposalText })
  } catch (error: unknown) {
    console.error('Proposal generation error:', error)
    const message = error instanceof Error ? error.message : 'Generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
