import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { clientName, clientCompany, projectDescription, scope, timeline, price, depositPercent } = await request.json()
    const depositAmount = Math.round(price * (depositPercent / 100))

    const proposalText = `Dear ${clientName}${clientCompany ? ` at ${clientCompany}` : ''},

Thank you for considering me for your project. Based on our discussion, I am pleased to present the following proposal.

## Project Overview
${projectDescription}

## Scope of Work
${scope}

## Timeline
${timeline}

## Investment
Total Project: $${price.toLocaleString()}
Deposit to Secure: $${depositAmount.toLocaleString()} (${depositPercent}%)
Remaining Balance: $${(price - depositAmount).toLocaleString()} (due upon project completion)

## Next Steps
1. Review this proposal
2. If everything looks good, approve and pay the deposit
3. We will begin work immediately upon deposit receipt

I look forward to working together.

Best regards`

    return NextResponse.json({ success: true, proposalText })
  } catch (error) {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
