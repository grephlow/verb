// "inquiries" collection — receives submissions from the /contact form.
// Admin-only collection: not shown anywhere on the site, public role only gets
// create access (no read/update/delete).

import { api, createCollection, addFields, strField, textareaField, emailField, selectField, PUBLIC_POLICY } from './_lib.mjs'

await createCollection('inquiries', {
  icon: 'mail',
  note: 'Saytda heç bir səhifədə göstərilmir — bu, yalnız adminkadakı bir gələnqutudur. /contact səhifəsindəki əlaqə formasını dolduran hər kəsin mesajı buraya avtomatik düşür.',
  display_template: '{{name}} — {{subject}}',
  translations: [
    { language: 'az-AZ', translation: 'Müraciətlər', singular: 'Müraciət', plural: 'Müraciətlər' },
    { language: 'en-US', translation: 'Inquiries', singular: 'Inquiry', plural: 'Inquiries' },
  ],
})

await addFields('inquiries', [
  strField('name', 'Ad Soyad', { required: true }),
  emailField('email', 'E-poçt Ünvanı'),
  strField('country', 'Ölkə'),
  selectField('subject', 'Mövzu', [
    { text: 'İştirak sorğusu', value: 'Participation inquiry' },
    { text: 'Ölkə nümayəndəsi müraciəti', value: 'Country representative application' },
    { text: 'Tərəfdaşlıq sorğusu', value: 'Partnership inquiry' },
    { text: 'Texniki dəstək', value: 'Technical support' },
    { text: 'Digər', value: 'Other' },
  ], { width: 'full' }),
  textareaField('message', 'Mesaj', { required: true }),
  selectField('status', 'Status', [
    { text: '🔵 Yeni', value: 'new' },
    { text: '👁 Oxunub', value: 'read' },
    { text: '✅ Cavablandırılıb', value: 'replied' },
  ], { width: 'half', defaultValue: 'new', note: 'Yalnız sizin işinizi asanlaşdırmaq üçündür — sayt ziyarətçiləri bunu görmür.' }),
])

// Directus' self-hosted entitlements only allow Public-role permissions that
// grant all fields with no extra rules (fields:['*'], empty permissions/validation) —
// scoping to specific fields here triggers a "custom_permission_rules_enabled" error.
await api('POST', '/permissions', {
  policy: PUBLIC_POLICY,
  collection: 'inquiries',
  action: 'create',
  permissions: {},
  validation: {},
  fields: ['*'],
})

console.log('✓ inquiries collection ready (public create only)')
