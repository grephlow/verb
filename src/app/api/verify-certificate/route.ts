import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')?.trim().toUpperCase()
  if (!code) {
    return NextResponse.json({ error: 'Missing certificate code.' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'certificates',
      where: { code: { equals: code } },
      limit: 1,
      depth: 1,
    })

    if (!docs[0]) {
      return NextResponse.json({ found: false })
    }

    const cert = docs[0]
    const country = cert.country && typeof cert.country === 'object'
      ? `${(cert.country as any).flag} ${(cert.country as any).name}`.trim()
      : ''
    return NextResponse.json({
      found: true,
      name: cert.nameSurname,
      country,
      grade: cert.grade,
      date: cert.examDate,
      score: cert.score,
      achievement: cert.achievement,
      type: cert.examType,
    })
  } catch (err) {
    console.error('[verify-certificate] Error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
