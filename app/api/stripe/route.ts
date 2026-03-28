import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { amount, proposalId } = await request.json()
    if (!amount || !proposalId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }
    return NextResponse.json({
      url: `https://buy.stripe.com/test?amount=${amount}`,
      demo: true
    })
  } catch (error) {
    return NextResponse.json({ error: 'Payment session creation failed' }, { status: 500 })
  }
}
