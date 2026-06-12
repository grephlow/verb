// Adds a "color" sub-field (Directus built-in color-swatch picker) to
// editions.scheduleDays, and sets default colors matching the previous
// hardcoded DAY_COLORS gradient stops on existing schedule days.
// Idempotent: safe to re-run.

import { api } from './_lib.mjs'

const DEFAULT_COLORS = ['#17205a', '#ff821a', '#e31a4a', '#1a7a3a', '#555555']
const FALLBACK_COLOR = '#555555'

// 1. Add the "color" sub-field to the scheduleDays repeater.
{
  const { data } = await api('GET', '/fields/editions/scheduleDays')
  const meta = { ...data.meta }
  delete meta.id
  const options = { ...meta.options }
  const fields = options.fields || []
  if (!fields.some((f) => f.field === 'color')) {
    const iconIdx = fields.findIndex((f) => f.field === 'icon')
    const insertAt = iconIdx >= 0 ? iconIdx + 1 : 0
    options.fields = [
      ...fields.slice(0, insertAt),
      { field: 'color', name: 'Rəng', type: 'string', meta: { interface: 'select-color', width: 'full', options: {} } },
      ...fields.slice(insertAt),
    ]
    meta.options = options
    await api('PATCH', '/fields/editions/scheduleDays', { meta })
    console.log('✓ editions.scheduleDays[].color field added')
  } else {
    console.log('· editions.scheduleDays[].color field already present')
  }
}

// 2. Populate color values on existing edition schedule days.
const { data: editions } = await api('GET', '/items/editions?fields=id,scheduleDays&limit=-1')
for (const ed of editions) {
  const days = ed.scheduleDays
  if (!days || days.length === 0) continue
  const updated = days.map((day, di) => ({ ...day, color: day.color || DEFAULT_COLORS[di] || FALLBACK_COLOR }))
  await api('PATCH', `/items/editions/${ed.id}`, { scheduleDays: updated })
  console.log(`✓ edition ${ed.id}: set colors for ${updated.length} schedule day(s)`)
}

console.log('Done.')
