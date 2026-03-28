import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { clientName, clientEmail, clientCompany, projectDescription, scope, timeline, price, depositPercent, proposalText } = await request.json()

    if (!clientName || !projectDescription || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Demo mode: return a generated ID (in production, save to Supabase)
    const id = `proposal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const depositAmount = Math.round(Number(price) * Number(depositPercent) / 100)

    const proposal = {
      id,
      client_name: clientName,
      client_email: clientEmail || '',
      client_company: clientCompany || '',
      project_description: projectDescription,
      scope: scope || '',
      timeline: timeline || '',
      price: Number(price),
      deposit_percent: Number(depositPercent),
      deposit_amount: depositAmount,
      status: 'draft',
      proposal_text: proposalText || '',
      created_at: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, proposal })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Save failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    // Demo mode: return empty array (in production, fetch from Supabase with user auth)
    return NextResponse.json({ proposals: [], demo: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Fetch failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
