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

    const prompt = `You are a professional proposal writer for freelancers. Write a compelling, polished business proposal email based on the following information:

CLIENT: ${clientName}${companyContext}
PROJECT NEEDS: ${projectDescription}
SCOPE OF WORK: ${scope}
TIMELINE: ${timeline}
PROJECT PRICE: $${price.toLocaleString()}
DEPOSIT REQUIRED: $${depositAmount.toLocaleString()} (${depositPercent}%)

Write this as a professional email proposal. Include:
1. A warm, professional greeting
2. Brief acknowledgment of their project
3. Project overview section
4. Detailed scope of work
5. Timeline with milestones
6. Investment breakdown (total price and deposit amount)
7. Clear next steps for them to approve and pay the deposit

Keep it concise but compelling. Use formatting like **bold** for key terms. The tone should be confident but not arrogant.`

    const response = await minimax.chat.completions.create({
      model: 'MiniMax-M2',
      messages: [
        {
          role: 'system',
          content: 'You are ProposeMint, an AI that writes professional, compelling business proposals for freelancers. Be confident, clear, and persuasive. Format proposals with proper sections and markdown-style emphasis.'
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
