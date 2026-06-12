// "editions" collection — the biggest one. 7 Payload "tabs" become 6 collapsible
// group-detail sections (tab 1, "Əsas Məlumat", stays ungrouped at the top).

import {
  api, createCollection, addFields, addRelations, setPublicRead,
  strField, emojiField, textareaField, intField, boolField, selectField, m2oField, fileField,
  relationDef, listField, subField, emojiSubField, iconSubField, colorSubField, groupField,
} from './_lib.mjs'

await createCollection('editions', {
  icon: 'emoji_events',
  note: 'Hər buraxılış /editions səhifəsində kart kimi görünür və "Slug" sahəsi vasitəsilə öz /editions/[slug] səhifəsinə (Haqqında, Təşkilatçı, Cədvəl, Qaydalar, İştirakçılar, Nəticələr alt-səhifələri) malikdir.',
  display_template: '{{shortTitle}}',
  translations: [
    { language: 'az-AZ', translation: 'Buraxılışlar', singular: 'Buraxılış', plural: 'Buraxılışlar' },
    { language: 'en-US', translation: 'Editions', singular: 'Edition', plural: 'Editions' },
  ],
})

/* ── Tab 1: Əsas Məlumat (ungrouped, shown first) ─────────────────── */
await addFields('editions', [
  strField('shortTitle', 'Kart Başlığı', { required: true, placeholder: '2026 UK' }),
  strField('slug', 'URL Slug', { placeholder: '2026-uk', note: 'Detal səhifəsi üçün MƏCBURİDİR. URL-də istifadə olunur: /editions/{slug}. Kiçik hərf, yalnız defis.' }),
  intField('year', 'İl', { width: 'half', defaultValue: null }),
  m2oField('hostCountry', 'Ev Sahibi Ölkə', { width: 'half', note: 'Faktiki ev sahibi ölkə. "TBA" və ya "Arxiv" kimi xüsusi buraxılışlar üçün boş saxlanıla bilər.' }),
  strField('hostCity', 'Ev Sahibi Şəhər', { width: 'half', placeholder: 'London' }),
  {
    ...emojiField('flag', 'Bayraq Emoji (ehtiyat)', { width: 'half', placeholder: '🇬🇧', note: 'Yalnız "Ev Sahibi Ölkə" boş olduqda istifadə olunur (TBA/Arxiv).' }),
  },
  {
    ...strField('hostCountryLabel', 'Ev Sahibi Etiketi (TBA/Arxiv üçün)', { placeholder: 'TBA', note: '"Ev Sahibi Ölkə" boş olduqda kart və başlıqlarda göstərilən mətn (məs. "TBA", "Arxiv").' }),
    meta: {
      interface: 'input', width: 'full', options: { placeholder: 'TBA' },
      note: '"Ev Sahibi Ölkə" boş olduqda kart və başlıqlarda göstərilən mətn (məs. "TBA", "Arxiv").',
      translations: [{ language: 'az-AZ', translation: 'Ev Sahibi Etiketi (TBA/Arxiv üçün)' }],
      hidden: true,
      conditions: [{ name: 'Ev Sahibi Ölkə boşdursa göstər', rule: { hostCountry: { _null: true } }, hidden: false }],
    },
  },
  fileField('image', 'Kart Şəkli', { width: 'half' }),
  fileField('heroImage', 'Hero Arxa Plan Şəkli', { width: 'half' }),
  selectField('status', 'Status', [
    { text: '🟢 Cari / Aktiv', value: 'current' },
    { text: '🔵 Gələcək', value: 'upcoming' },
    { text: '📁 Keçmiş / Arxiv', value: 'past' },
  ], { defaultValue: 'upcoming' }),
  strField('dates', 'Tədbir Tarixləri', { width: 'half', placeholder: '14–18 İyul 2026' }),
  strField('organizer', 'Təşkilatçı', { width: 'half', placeholder: 'SchoolConnect UK' }),
  textareaField('description', 'Kart Açıqlaması'),
  intField('order', 'Sıra', { note: 'Az = əvvəldə.' }),
])

await addRelations([
  relationDef('editions', 'hostCountry', 'countries'),
  relationDef('editions', 'image', 'directus_files'),
  relationDef('editions', 'heroImage', 'directus_files'),
])

/* ── Group: 2️⃣ Haqqında ────────────────────────────────────────── */
await addFields('editions', [groupField('group_about', '2️⃣ Haqqında')])
await addFields('editions', [
  { ...strField('aboutTitle', 'Xoş Gəlmisiniz Başlığı', { placeholder: 'Birləşmiş Krallığa xoş gəlmisiniz' }), meta: { group: 'group_about', interface: 'input', width: 'full', options: { placeholder: 'Birləşmiş Krallığa xoş gəlmisiniz' }, translations: [{ language: 'az-AZ', translation: 'Xoş Gəlmisiniz Başlığı' }] } },
  { ...textareaField('aboutText', 'Xoş Gəlmisiniz Mətni'), meta: { group: 'group_about', interface: 'textarea', width: 'full', translations: [{ language: 'az-AZ', translation: 'Xoş Gəlmisiniz Mətni' }] } },
  { ...strField('participantsCount', 'İştirakçı Sayı', { width: 'half', defaultValue: '35+' }), meta: { group: 'group_about', interface: 'input', width: 'half', translations: [{ language: 'az-AZ', translation: 'İştirakçı Sayı' }] } },
  { ...strField('duration', 'Müddət', { width: 'half', defaultValue: '5 gün' }), meta: { group: 'group_about', interface: 'input', width: 'half', translations: [{ language: 'az-AZ', translation: 'Müddət' }] } },
  { ...listField('destinationCards', 'Məkan Bələdçisi Kartları', [
    emojiSubField('icon', 'Emoji İkon'),
    subField('imageUrl', 'Şəkil URL-i', 'string'),
    subField('title', 'Başlıq', 'string'),
    subField('content', 'Məzmun', 'text'),
  ], { template: '{{title}}', note: 'Yerləşmə, Yemək, Necə Getmək və s. — hər biri ayrı kart.' }), meta: { group: 'group_about', interface: 'list', width: 'full', special: ['cast-json'], options: { template: '{{title}}', fields: [
    emojiSubField('icon', 'Emoji İkon'),
    subField('imageUrl', 'Şəkil URL-i', 'string'),
    subField('title', 'Başlıq', 'string'),
    subField('content', 'Məzmun', 'text'),
  ], addLabel: 'Əlavə et' }, note: 'Yerləşmə, Yemək, Necə Getmək və s. — hər biri ayrı kart.', translations: [{ language: 'az-AZ', translation: 'Məkan Bələdçisi Kartları' }] } },
])

/* ── Group: 3️⃣ Təşkilatçı ──────────────────────────────────────── */
await addFields('editions', [groupField('group_organizer', '3️⃣ Təşkilatçı')])
const orgField = (name, label, type = 'string') => ({
  field: name, type: type === 'text' ? 'text' : 'string',
  meta: { group: 'group_organizer', interface: type === 'text' ? 'textarea' : 'input', width: type === 'text' ? 'full' : 'half', translations: [{ language: 'az-AZ', translation: label }] },
})
await addFields('editions', [
  orgField('hostInstitutionName', 'Ev Sahibi Qurum: Ad'),
  orgField('hostInstitutionWebsite', 'Ev Sahibi Qurum: Vebsayt'),
  orgField('hostInstitutionDescription', 'Ev Sahibi Qurum: Açıqlama (1)', 'text'),
  orgField('hostInstitutionDescription2', 'Ev Sahibi Qurum: Açıqlama (2)', 'text'),
  orgField('hostInstitutionAddress', 'Ev Sahibi Qurum: Ünvan'),
  orgField('hostInstitutionEmail', 'Ev Sahibi Qurum: E-poçt'),
  orgField('hostInstitutionPhone', 'Ev Sahibi Qurum: Telefon'),
  orgField('academicPartnerName', 'Akademik Tərəfdaş: Ad'),
  orgField('academicPartnerDescription', 'Akademik Tərəfdaş: Açıqlama', 'text'),
  orgField('venuePartnerName', 'Məkan Tərəfdaşı: Ad'),
  orgField('venuePartnerDescription', 'Məkan Tərəfdaşı: Açıqlama', 'text'),
  { field: 'organizerResponsibilities', type: 'text', meta: { group: 'group_organizer', interface: 'textarea', width: 'full', note: 'Hər sətir nöqtəli siyahıya çevrilir.', translations: [{ language: 'az-AZ', translation: 'Məsuliyyətlər' }] } },
  {
    field: 'committeeMembers', type: 'json',
    meta: { group: 'group_organizer', interface: 'list', special: ['cast-json'], width: 'full', options: { template: '{{name}}', fields: [
      subField('name', 'Ad Soyad', 'string'),
      subField('role', 'Vəzifə / Şöbə', 'string'),
      subField('badge', 'Status Nişanı', 'string'),
    ], addLabel: 'Əlavə et' }, translations: [{ language: 'az-AZ', translation: 'Yerli Komitə Üzvləri' }] },
  },
  {
    field: 'contactBlocks', type: 'json',
    meta: { group: 'group_organizer', interface: 'list', special: ['cast-json'], width: 'full', options: { template: '{{label}}: {{value}}', fields: [
      subField('label', 'Etiket', 'string'),
      subField('value', 'Dəyər', 'string'),
    ], addLabel: 'Əlavə et' }, translations: [{ language: 'az-AZ', translation: 'Əlaqə Məlumatları' }] },
  },
])

/* ── Group: 4️⃣ Cədvəl ──────────────────────────────────────────── */
await addFields('editions', [groupField('group_schedule', '4️⃣ Cədvəl')])
await addFields('editions', [
  {
    field: 'scheduleDays', type: 'json',
    meta: { group: 'group_schedule', interface: 'list', special: ['cast-json'], width: 'full', options: { template: '{{dayLabel}}', fields: [
      iconSubField('icon', 'İkon'),
      colorSubField('color', 'Rəng'),
      subField('dayLabel', 'Gün Etiketi', 'string'),
      subField('dayTitle', 'Gün Başlığı', 'string'),
      subField('dayNote', 'Gün Qeydi', 'string'),
      {
        field: 'items', name: 'Cədvəl Elementləri', type: 'json',
        meta: { interface: 'list', width: 'full', options: { template: '{{activity}}', fields: [
          subField('time', 'Vaxt', 'string'),
          subField('activity', 'Fəaliyyət', 'string'),
          subField('note', 'Qeyd', 'string'),
          subField('highlight', 'Sətri vurgula (imtahan/mərasim)', 'boolean'),
        ], addLabel: 'Əlavə et' } },
      },
    ], addLabel: 'Gün əlavə et' }, note: 'Hər gün üçün bir qeyd əlavə edin.', translations: [{ language: 'az-AZ', translation: 'Günlər' }] },
  },
  { ...textareaField('scheduleNotes', 'Mühüm Qeydlər'), meta: { group: 'group_schedule', interface: 'textarea', width: 'full', note: 'Cədvəl səhifəsinin altındakı qeydlər panelində göstərilir.', translations: [{ language: 'az-AZ', translation: 'Mühüm Qeydlər' }] } },
  { ...strField('schedulePdfUrl', 'PDF Yükləmə URL', { placeholder: '/uploads/programme.pdf' }), meta: { group: 'group_schedule', interface: 'input', width: 'full', options: { placeholder: '/uploads/programme.pdf' }, translations: [{ language: 'az-AZ', translation: 'PDF Yükləmə URL' }] } },
])

/* ── Group: 5️⃣ Qaydalar ────────────────────────────────────────── */
await addFields('editions', [groupField('group_rules', '5️⃣ Qaydalar')])
await addFields('editions', [
  {
    field: 'ruleDocuments', type: 'json',
    meta: { group: 'group_rules', interface: 'list', special: ['cast-json'], width: 'full', options: { template: '{{title}}', fields: [
      subField('title', 'Başlıq', 'string'),
      subField('description', 'Açıqlama', 'text'),
      subField('downloadUrl', 'Yükləmə URL', 'string'),
    ], addLabel: 'Əlavə et' }, translations: [{ language: 'az-AZ', translation: 'Rəsmi Sənədlər' }] },
  },
  {
    field: 'ruleSections', type: 'json',
    meta: { group: 'group_rules', interface: 'list', special: ['cast-json'], width: 'full', options: { template: '{{title}}', fields: [
      emojiSubField('icon', 'Emoji İkon'),
      subField('title', 'Başlıq', 'string'),
      subField('content', 'Məzmun', 'text'),
    ], addLabel: 'Əlavə et' }, translations: [{ language: 'az-AZ', translation: 'Akkordeon Bölmələri' }] },
  },
])

/* ── Group: 6️⃣ İştirakçılar ────────────────────────────────────── */
await addFields('editions', [groupField('group_participants', '6️⃣ İştirakçılar')])
await addFields('editions', [
  {
    field: 'countryDelegations', type: 'json',
    meta: { group: 'group_participants', interface: 'list', special: ['cast-json'], width: 'full', options: { template: '{{countryFlag}} {{countryName}}', fields: [
      subField('countryName', 'Ölkə Adı', 'string'),
      emojiSubField('countryFlag', 'Bayraq Emoji'),
      subField('teamLeader', 'Komanda Rəhbəri', 'string'),
      subField('organization', 'Təşkilat', 'string'),
      {
        field: 'students', name: 'Şagirdlər', type: 'json',
        meta: { interface: 'list', width: 'full', options: { template: '{{name}}', fields: [
          subField('name', 'Ad Soyad', 'string'),
          subField('class', 'Sinif', 'string'),
          { field: 'category', name: 'Kateqoriya', type: 'string', meta: { interface: 'select-dropdown', width: 'full', options: { choices: ['Junior A', 'Junior B', 'Intermediate', 'Senior'].map((v) => ({ text: v, value: v })) } } },
          subField('score', 'Bal', 'string'),
          { field: 'medal', name: 'Medal', type: 'string', meta: { interface: 'select-dropdown', width: 'full', options: { choices: ['Gold', 'Silver', 'Bronze', 'Honorable Mention', 'Participation'].map((v) => ({ text: v, value: v })) } } },
        ], addLabel: 'Şagird əlavə et' } },
      },
    ], addLabel: 'Heyət əlavə et' }, note: 'Bayraq və ölkə adını birbaşa yazın.', translations: [{ language: 'az-AZ', translation: 'Ölkə Nümayəndə Heyətləri' }] },
  },
  { ...strField('participantsNote', 'Alt Qeyd', { placeholder: 'Tam siyahı qeydiyyat bağlandıqdan sonra dərc ediləcək.' }), meta: { group: 'group_participants', interface: 'input', width: 'full', options: { placeholder: 'Tam siyahı qeydiyyat bağlandıqdan sonra dərc ediləcək.' }, translations: [{ language: 'az-AZ', translation: 'Alt Qeyd' }] } },
])

/* ── Group: 7️⃣ Nəticələr ───────────────────────────────────────── */
await addFields('editions', [groupField('group_results', '7️⃣ Nəticələr')])
await addFields('editions', [
  {
    field: 'medalTable', type: 'json',
    meta: { group: 'group_results', interface: 'list', special: ['cast-json'], width: 'full', options: { template: '{{countryFlag}} {{countryName}}', fields: [
      subField('countryName', 'Ölkə Adı', 'string'),
      emojiSubField('countryFlag', 'Bayraq Emoji'),
      { field: 'gold', name: 'Qızıl', type: 'integer', meta: { interface: 'input', width: 'half' } },
      { field: 'silver', name: 'Gümüş', type: 'integer', meta: { interface: 'input', width: 'half' } },
      { field: 'bronze', name: 'Bürünc', type: 'integer', meta: { interface: 'input', width: 'half' } },
      { field: 'honorable', name: 'Fəxri Qeyd', type: 'integer', meta: { interface: 'input', width: 'half' } },
      { field: 'participation', name: 'İştirak', type: 'integer', meta: { interface: 'input', width: 'half' } },
      { field: 'hasDetails', name: '"Bax →" düyməsini göstər', type: 'boolean', meta: { interface: 'boolean', width: 'half' } },
    ], addLabel: 'Sətir əlavə et' }, translations: [{ language: 'az-AZ', translation: 'Medal Cədvəli' }] },
  },
])

await setPublicRead(['editions'])
console.log('✓ editions collection ready')
