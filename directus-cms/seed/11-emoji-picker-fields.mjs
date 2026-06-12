// Wires up the custom "Emoji Picker" interface (extensions/emoji-picker) onto every
// emoji/flag field across the admin — top-level string fields and subfields inside
// JSON "list" (repeater) fields. Idempotent: safe to re-run.

import { api } from './_lib.mjs'

const TOP_LEVEL = [
  ['countries', 'flag'],
  ['editions', 'flag'],
  ['regulations', 'icon'],
  ['preliminary_resources', 'roundIcon'],
]

const REPEATERS = [
  ['categories', 'contentSections', ['icon']],
  ['editions', 'destinationCards', ['icon']],
  ['editions', 'ruleSections', ['icon']],
  ['editions', 'countryDelegations', ['countryFlag']],
  ['editions', 'medalTable', ['countryFlag']],
  ['about_page', 'missionCards', ['icon']],
]

for (const [collection, field] of TOP_LEVEL) {
  const { data } = await api('GET', `/fields/${collection}/${field}`)
  const meta = { ...data.meta }
  delete meta.id
  meta.interface = 'emoji-picker'
  meta.options = null
  await api('PATCH', `/fields/${collection}/${field}`, { meta })
  console.log(`✓ ${collection}.${field} -> emoji-picker`)
}

for (const [collection, field, subFieldNames] of REPEATERS) {
  const { data } = await api('GET', `/fields/${collection}/${field}`)
  const meta = { ...data.meta }
  delete meta.id
  const options = { ...meta.options }
  options.fields = (options.fields || []).map((sf) =>
    subFieldNames.includes(sf.field)
      ? { ...sf, meta: { ...sf.meta, interface: 'emoji-picker', options: null } }
      : sf
  )
  meta.options = options
  await api('PATCH', `/fields/${collection}/${field}`, { meta })
  console.log(`✓ ${collection}.${field}[].{${subFieldNames.join(',')}} -> emoji-picker`)
}

console.log('Done.')
