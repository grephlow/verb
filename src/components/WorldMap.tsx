'use client'

import { useState, useCallback, useMemo } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const GEO_URL = '/world-50m.json'

// ─── Alias table ────────────────────────────────────────────────────────────
// Keys: lowercase variants the admin might type
// Values: EXACT name as it appears in world-atlas
const ALIAS: Record<string, string> = {
  // Turkey
  'türkiye': 'Turkey',
  'turkiye': 'Turkey',
  'turkey': 'Turkey',
  // USA
  'united states': 'United States of America',
  'united states of america': 'United States of America',
  'usa': 'United States of America',
  'u.s.a.': 'United States of America',
  'u.s.': 'United States of America',
  'us': 'United States of America',
  'america': 'United States of America',
  // UK
  'united kingdom': 'United Kingdom',
  'uk': 'United Kingdom',
  'u.k.': 'United Kingdom',
  'great britain': 'United Kingdom',
  'britain': 'United Kingdom',
  'england': 'United Kingdom',
  // Russia
  'russia': 'Russia',
  'russian federation': 'Russia',
  // China
  "china": 'China',
  "people's republic of china": 'China',
  "prc": 'China',
  // South Korea
  'south korea': 'South Korea',
  'korea': 'South Korea',
  'republic of korea': 'South Korea',
  'kor': 'South Korea',
  // North Korea
  'north korea': 'North Korea',
  'dprk': 'North Korea',
  "democratic people's republic of korea": 'North Korea',
  // Czech Republic
  'czech republic': 'Czechia',
  'czechia': 'Czechia',
  'czech': 'Czechia',
  // Bosnia
  'bosnia and herzegovina': 'Bosnia and Herz.',
  'bosnia & herzegovina': 'Bosnia and Herz.',
  'bosnia-herzegovina': 'Bosnia and Herz.',
  'bosnia': 'Bosnia and Herz.',
  // North Macedonia
  'north macedonia': 'Macedonia',
  'republic of north macedonia': 'Macedonia',
  'macedonia': 'Macedonia',
  // Ivory Coast
  "ivory coast": "Côte d'Ivoire",
  "cote d'ivoire": "Côte d'Ivoire",
  "côte d'ivoire": "Côte d'Ivoire",
  "cote divoire": "Côte d'Ivoire",
  // DR Congo
  'dr congo': 'Dem. Rep. Congo',
  'democratic republic of congo': 'Dem. Rep. Congo',
  'democratic republic of the congo': 'Dem. Rep. Congo',
  'drc': 'Dem. Rep. Congo',
  'congo (kinshasa)': 'Dem. Rep. Congo',
  // Republic of Congo
  'congo': 'Congo',
  'republic of congo': 'Congo',
  'congo (brazzaville)': 'Congo',
  // South Sudan
  'south sudan': 'S. Sudan',
  's. sudan': 'S. Sudan',
  // UAE
  'uae': 'United Arab Emirates',
  'u.a.e.': 'United Arab Emirates',
  'united arab emirates': 'United Arab Emirates',
  // Dominican Republic
  'dominican republic': 'Dominican Rep.',
  'dominican rep.': 'Dominican Rep.',
  // Central African Republic
  'central african republic': 'Central African Rep.',
  'car': 'Central African Rep.',
  // Equatorial Guinea
  'equatorial guinea': 'Eq. Guinea',
  'eq. guinea': 'Eq. Guinea',
  // eSwatini
  'swaziland': 'eSwatini',
  'eswatini': 'eSwatini',
  'kingdom of eswatini': 'eSwatini',
  // Kosovo
  'republic of kosovo': 'Kosovo',
  'kosovo': 'Kosovo',
  // Laos
  'laos': 'Laos',
  'lao pdr': 'Laos',
  "lao people's democratic republic": 'Laos',
  'lao': 'Laos',
  // East Timor
  'east timor': 'Timor-Leste',
  'timor-leste': 'Timor-Leste',
  'timor leste': 'Timor-Leste',
  // Palestine
  'palestine': 'Palestine',
  'palestinian territories': 'Palestine',
  'palestinian territory': 'Palestine',
  'west bank': 'Palestine',
  // Myanmar/Burma
  'myanmar': 'Myanmar',
  'burma': 'Myanmar',
  // Iran
  'iran': 'Iran',
  'islamic republic of iran': 'Iran',
  // Syria
  'syria': 'Syria',
  'syrian arab republic': 'Syria',
  // Tanzania
  'tanzania': 'Tanzania',
  'united republic of tanzania': 'Tanzania',
  // Moldova
  'moldova': 'Moldova',
  'republic of moldova': 'Moldova',
  // Vietnam
  'vietnam': 'Vietnam',
  'viet nam': 'Vietnam',
  // Libya
  'libya': 'Libya',
  'state of libya': 'Libya',
  // Venezuela
  'venezuela': 'Venezuela',
  'bolivarian republic of venezuela': 'Venezuela',
  // Bolivia
  'bolivia': 'Bolivia',
  'plurinational state of bolivia': 'Bolivia',
  // Falkland Islands
  'falkland islands': 'Falkland Is.',
  'falkland is.': 'Falkland Is.',
  'malvinas': 'Falkland Is.',
  // Solomon Islands
  'solomon islands': 'Solomon Is.',
  // Papua New Guinea
  'papua new guinea': 'Papua New Guinea',
  'png': 'Papua New Guinea',
  // Western Sahara
  'western sahara': 'W. Sahara',
  'w. sahara': 'W. Sahara',
  // Sri Lanka
  'sri lanka': 'Sri Lanka',
  'ceylon': 'Sri Lanka',
  // New Caledonia
  'new caledonia': 'New Caledonia',
  // Puerto Rico
  'puerto rico': 'Puerto Rico',
  // Somaliland
  'somaliland': 'Somaliland',
  // North Cyprus
  'north cyprus': 'N. Cyprus',
  'northern cyprus': 'N. Cyprus',
  // Trinidad & Tobago
  'trinidad and tobago': 'Trinidad and Tobago',
  'trinidad & tobago': 'Trinidad and Tobago',
}

// Resolve a DB country name to an exact world-atlas name
function resolveToAtlas(name: string): string {
  const trimmed = name.trim()
  const lower = trimmed.toLowerCase()
  return ALIAS[lower] ?? trimmed
}

// ─── Types ───────────────────────────────────────────────────────────────────
type CountryDoc = {
  id: string
  name: string
  flag?: string
  status?: string
  representative?: string
  notes?: string
}

// ─── Colours ─────────────────────────────────────────────────────────────────
const STATUS_FILL: Record<string, string> = {
  Active:  'rgba(255,130,26,0.70)',
  Observer:'rgba(42,167,255,0.65)',
  Pending: 'rgba(255,209,102,0.75)',
}
const STATUS_FILL_HOVER: Record<string, string> = {
  Active:  'rgba(255,130,26,0.90)',
  Observer:'rgba(42,167,255,0.88)',
  Pending: 'rgba(255,209,102,0.95)',
}
const STATUS_STROKE: Record<string, string> = {
  Active:  '#ff821a',
  Observer:'#2aa7ff',
  Pending: '#ffd166',
}
// Slightly darker variants for use as readable text on a light tinted background
const STATUS_TEXT: Record<string, string> = {
  Active:  '#ff821a',
  Observer:'#2aa7ff',
  Pending: '#c9941a',
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function WorldMap({ countries, mobile = false }: { countries: CountryDoc[]; mobile?: boolean }) {
  const [tooltip, setTooltip] = useState<{
    name: string; status: string; rep: string; x: number; y: number
  } | null>(null)

  const [selected, setSelected] = useState<{
    atlasName: string; name: string; status: string; rep: string; flag: string
  } | null>(null)

  // Build two maps:
  //   lookup     — exact atlas name  → doc
  //   lookupLC   — lowercase atlas name → doc  (fallback)
  const { lookup, lookupLC } = useMemo(() => {
    const lookup   = new Map<string, CountryDoc>()
    const lookupLC = new Map<string, CountryDoc>()
    for (const c of countries) {
      const atlasName = resolveToAtlas(c.name)
      lookup.set(atlasName, c)
      lookupLC.set(atlasName.toLowerCase(), c)
    }
    return { lookup, lookupLC }
  }, [countries])

  const findDoc = useCallback((atlasName: string): CountryDoc | undefined =>
    lookup.get(atlasName) ?? lookupLC.get(atlasName.toLowerCase()),
  [lookup, lookupLC])

  const handleMouseMove = useCallback((e: React.MouseEvent, doc: CountryDoc) => {
    const rect = (e.currentTarget as SVGElement).closest('svg')!.getBoundingClientRect()
    setTooltip({
      name: doc.name,
      status: doc.status || '',
      rep: doc.representative || '',
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  const handleMouseLeave = useCallback(() => setTooltip(null), [])

  const handleClick = useCallback((atlasName: string, doc: CountryDoc) => {
    setSelected((prev) => (prev?.atlasName === atlasName ? null : {
      atlasName,
      name: doc.name,
      status: doc.status || '',
      rep: doc.representative || '',
      flag: doc.flag || '',
    }))
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 130, center: [0, 20] }}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const atlasName: string = (geo.properties as { name: string }).name
              const doc    = findDoc(atlasName)
              const status = doc?.status ?? ''

              const fill      = doc ? (STATUS_FILL[status]       ?? 'rgba(180,200,240,0.6)')  : '#c8d8f0'
              const fillHover = doc ? (STATUS_FILL_HOVER[status] ?? 'rgba(180,200,240,0.85)') : '#b8cce0'
              const stroke    = doc ? (STATUS_STROKE[status]     ?? '#a0b8d8')                : '#afc8e8'
              const isSelected = mobile && selected?.atlasName === atlasName

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isSelected ? fillHover : fill}
                  stroke={isSelected ? '#17205a' : stroke}
                  strokeWidth={isSelected ? 1.2 : 0.4}
                  className={isSelected ? 'mob-map-selected' : undefined}
                  style={{
                    default: { outline: 'none', cursor: doc ? 'pointer' : 'default' },
                    hover:   { fill: fillHover, outline: 'none', cursor: doc ? 'pointer' : 'default' },
                    pressed: { outline: 'none' },
                  }}
                  onMouseMove={!mobile && doc ? (e: React.MouseEvent) => handleMouseMove(e, doc) : undefined}
                  onMouseLeave={!mobile && doc ? handleMouseLeave : undefined}
                  onClick={mobile && doc ? () => handleClick(atlasName, doc) : undefined}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip (desktop hover) */}
      {!mobile && tooltip && (
        <div style={{
          position: 'absolute',
          left: tooltip.x + 14,
          top: tooltip.y - 8,
          background: '#17205a',
          color: '#fff',
          borderRadius: 12,
          padding: '8px 14px',
          fontSize: 13,
          fontWeight: 800,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          boxShadow: '0 8px 24px rgba(16,23,66,.3)',
          zIndex: 20,
        }}>
          <div>{tooltip.name}</div>
          {tooltip.status && (
            <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.75, marginTop: 2 }}>
              {tooltip.status}
            </div>
          )}
          {tooltip.rep && (
            <div style={{ fontSize: 11, opacity: 0.65, marginTop: 1 }}>{tooltip.rep}</div>
          )}
        </div>
      )}

      {/* Tap-to-select info panel (mobile) */}
      {mobile && (
        <div className="mob-map-info">
          {selected ? (
            <>
              <div className="mob-map-info-flag">{selected.flag || '🌍'}</div>
              <div className="mob-map-info-text">
                <strong>{selected.name}</strong>
                {selected.rep && <span>{selected.rep}</span>}
                {selected.status && (
                  <span
                    className="mob-map-info-status"
                    style={{
                      color: STATUS_TEXT[selected.status] || 'var(--muted)',
                      background: (STATUS_TEXT[selected.status] || 'var(--muted)') + '18',
                    }}
                  >
                    {selected.status}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="mob-map-hint">🗺️ Tap a highlighted country to see its representative</div>
          )}
        </div>
      )}

    </div>
  )
}
