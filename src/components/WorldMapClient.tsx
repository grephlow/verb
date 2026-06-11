'use client'

import dynamic from 'next/dynamic'

const WorldMap = dynamic(() => import('./WorldMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 420,
        borderRadius: 24,
        background: 'linear-gradient(145deg,#e8f4ff 0%,#fff7ed 50%,#f0fff4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#69738a',
        fontWeight: 800,
        fontSize: 15,
      }}
    >
      Loading map…
    </div>
  ),
})

const WorldMapMobile = dynamic(() => import('./WorldMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 240,
        background: 'linear-gradient(145deg,#e8f4ff 0%,#fff7ed 50%,#f0fff4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#69738a',
        fontWeight: 800,
        fontSize: 15,
      }}
    >
      Loading map…
    </div>
  ),
})

type CountryDoc = {
  id: string
  name: string
  flag?: string
  status?: string
  representative?: string
  notes?: string
}

export default function WorldMapClient({ countries, mobile }: { countries: CountryDoc[]; mobile?: boolean }) {
  if (mobile) return <WorldMapMobile countries={countries} mobile />
  return <WorldMap countries={countries} />
}
