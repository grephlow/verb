import { NextRequest, NextResponse } from 'next/server'

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message, country } = body

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const res = await fetch(`${DIRECTUS_URL}/items/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        subject: subject || 'Other',
        message: message.trim(),
        country: country?.trim() || '',
        status: 'new',
      }),
    })
    if (!res.ok) throw new Error(`Directus create failed (${res.status})`)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] Error saving inquiry:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
