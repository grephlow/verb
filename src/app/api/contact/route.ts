import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message, country } = body

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    await payload.create({
      collection: 'inquiries',
      data: {
        name: name.trim(),
        email: email.trim(),
        subject: subject || 'Other',
        message: message.trim(),
        country: country?.trim() || '',
        status: 'new',
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] Error saving inquiry:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
