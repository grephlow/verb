// Adds an "icon" sub-field (custom "Icon Picker" interface, extensions/icon-picker)
// to editions.scheduleDays, and sets sensible default icons on existing schedule days.
// Idempotent: safe to re-run.

import { api } from './_lib.mjs'

const ICON_BY_DAY_TITLE = {
  'Arrival Day': 'Airplane',
  'Registration & Opening Ceremony': 'Ticket',
  'Grand Final Examination Day': 'PencilSimple',
  'Cultural Day & Gala Award Ceremony': 'Trophy',
  'Departure Day': 'AirplaneTakeoff',
}
const DEFAULT_ICON = 'CalendarBlank'

// 1. Add the "icon" sub-field to the scheduleDays repeater.
{
  const { data } = await api('GET', '/fields/editions/scheduleDays')
  const meta = { ...data.meta }
  delete meta.id
  const options = { ...meta.options }
  const fields = options.fields || []
  if (!fields.some((f) => f.field === 'icon')) {
    options.fields = [
      { field: 'icon', name: 'İkon', type: 'string', meta: { interface: 'icon-picker', width: 'full', options: null } },
      ...fields,
    ]
    meta.options = options
    await api('PATCH', '/fields/editions/scheduleDays', { meta })
    console.log('✓ editions.scheduleDays[].icon field added')
  } else {
    console.log('· editions.scheduleDays[].icon field already present')
  }
}

// 2. Populate icon values on existing edition schedule days.
const { data: editions } = await api('GET', '/items/editions?fields=id,scheduleDays&limit=-1')
for (const ed of editions) {
  const days = ed.scheduleDays
  if (!days || days.length === 0) continue
  const updated = days.map((day) => ({ icon: ICON_BY_DAY_TITLE[day.dayTitle] || DEFAULT_ICON, ...day }))
  await api('PATCH', `/items/editions/${ed.id}`, { scheduleDays: updated })
  console.log(`✓ edition ${ed.id}: set icons for ${updated.length} schedule day(s)`)
}

console.log('Done.')
