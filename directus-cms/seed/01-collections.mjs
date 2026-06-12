// Sets up the "gallery", "news" and "faq" collections in Directus —
// a recreation of the equivalent Payload CMS collections, using Directus-native
// features (drag-to-reorder, status workflow, no-code conditional fields, file picker).

const BASE = 'http://localhost:8055'
const TOKEN = 'verbivore-concept-admin-token'

async function api(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let json
  try { json = text ? JSON.parse(text) : null } catch { json = text }
  if (!res.ok) {
    console.error(`${method} ${path} -> ${res.status}`)
    console.error(JSON.stringify(json, null, 2))
    throw new Error(`Request failed: ${method} ${path}`)
  }
  return json
}

const statusField = {
  field: 'status',
  type: 'string',
  meta: {
    width: 'half',
    interface: 'select-dropdown',
    options: {
      choices: [
        { text: '$t:published', value: 'published', icon: 'check_circle', color: 'var(--theme--primary)' },
        { text: '$t:draft', value: 'draft', icon: 'pending', color: 'var(--theme--foreground-subdued)' },
        { text: '$t:archived', value: 'archived', icon: 'archive', color: 'var(--theme--warning)' },
      ],
    },
    display: 'labels',
    display_options: { showAsDot: true },
  },
  schema: { default_value: 'draft', is_nullable: false },
}

const sortField = {
  field: 'sort',
  type: 'integer',
  meta: { interface: 'input', hidden: true },
}

/* ───────────────────────── Gallery ───────────────────────── */

await api('POST', '/collections', {
  collection: 'gallery',
  meta: {
    icon: 'photo_library',
    note: 'Əsas səhifənin "Foto və Video" qalereyası. Sıraya görə birinci element böyük kart, sonraki 2-si sağda kiçik kartlar kimi göstərilir.',
    display_template: '{{title}}',
    sort_field: 'sort',
    translations: [
      { language: 'az-AZ', translation: 'Qalereya', singular: 'Qalereya elementi', plural: 'Qalereya elementləri' },
      { language: 'en-US', translation: 'Gallery', singular: 'Gallery item', plural: 'Gallery items' },
    ],
  },
  schema: {},
  fields: [
    {
      field: 'id',
      type: 'integer',
      meta: { hidden: true, interface: 'input', readonly: true },
      schema: { is_primary_key: true, has_auto_increment: true },
    },
  ],
})

for (const field of [statusField, sortField]) {
  await api('POST', '/fields/gallery', field)
}

// media_type — drives which of image / video_file / video_url is shown
await api('POST', '/fields/gallery', {
  field: 'media_type',
  type: 'string',
  meta: {
    width: 'half',
    interface: 'select-radio',
    options: {
      choices: [
        { text: '🖼️ Şəkil', value: 'photo' },
        { text: '🎬 Video', value: 'video' },
      ],
    },
    translations: [
      { language: 'az-AZ', translation: 'Media Növü' },
      { language: 'en-US', translation: 'Media Type' },
    ],
  },
  schema: { default_value: 'photo', is_nullable: false },
})

// image — used for photo cards, and as the video poster
await api('POST', '/fields/gallery', {
  field: 'image',
  type: 'uuid',
  meta: {
    interface: 'file-image',
    special: ['file'],
    width: 'full',
    note: 'Foto kartı üçün əsas şəkil. Video seçildikdə kartın arxa fon şəkli (poster) kimi istifadə olunur.',
    translations: [
      { language: 'az-AZ', translation: 'Şəkil' },
      { language: 'en-US', translation: 'Image' },
    ],
  },
})
await api('POST', '/relations', { collection: 'gallery', field: 'image', related_collection: 'directus_files' })

// video_file — shown only when media_type === 'video'
await api('POST', '/fields/gallery', {
  field: 'video_file',
  type: 'uuid',
  meta: {
    interface: 'file',
    special: ['file'],
    width: 'full',
    note: 'Yüklənmiş video (mp4 və s.). YouTube linki istifadə edirsinizsə boş buraxın.',
    conditions: [
      { name: 'Video seçilibsə göstər', rule: { media_type: { _eq: 'video' } }, hidden: false },
    ],
    hidden: true,
    translations: [
      { language: 'az-AZ', translation: 'Video Fayl' },
      { language: 'en-US', translation: 'Video File' },
    ],
  },
})
await api('POST', '/relations', { collection: 'gallery', field: 'video_file', related_collection: 'directus_files' })

// video_url — shown only when media_type === 'video'
await api('POST', '/fields/gallery', {
  field: 'video_url',
  type: 'string',
  meta: {
    interface: 'input',
    width: 'full',
    options: { placeholder: 'https://youtu.be/XXXXXXXXXXX' },
    note: '"Video Fayl" yüklənməyibsə, buraya YouTube linki yazın.',
    conditions: [
      { name: 'Video seçilibsə göstər', rule: { media_type: { _eq: 'video' } }, hidden: false },
    ],
    hidden: true,
    translations: [
      { language: 'az-AZ', translation: 'YouTube Linki' },
      { language: 'en-US', translation: 'YouTube Link' },
    ],
  },
})

await api('POST', '/fields/gallery', {
  field: 'title',
  type: 'string',
  meta: {
    interface: 'input',
    width: 'full',
    required: true,
    options: { placeholder: 'Beynəlxalq şagird təcrübəsi' },
    translations: [
      { language: 'az-AZ', translation: 'Başlıq' },
      { language: 'en-US', translation: 'Title' },
    ],
  },
  schema: { is_nullable: false },
})

await api('POST', '/fields/gallery', {
  field: 'subtitle',
  type: 'string',
  meta: {
    interface: 'input',
    width: 'full',
    options: { placeholder: 'Kartda göstərilən qısa açıqlama.' },
    translations: [
      { language: 'az-AZ', translation: 'Alt Başlıq' },
      { language: 'en-US', translation: 'Subtitle' },
    ],
  },
})

await api('POST', '/fields/gallery', {
  field: 'tag',
  type: 'string',
  meta: {
    width: 'half',
    interface: 'input',
    note: 'Nişan kimi göstərilən etiket: "Foto", "Video", "Seçilmiş Media" və s.',
    translations: [
      { language: 'az-AZ', translation: 'Etiket' },
      { language: 'en-US', translation: 'Tag' },
    ],
  },
  schema: { default_value: 'Foto' },
})

await api('POST', '/fields/gallery', {
  field: 'stage',
  type: 'string',
  meta: {
    width: 'half',
    interface: 'select-dropdown',
    options: {
      choices: [
        { text: '🟠 İlkin Seçim (Preliminary Round)', value: 'preliminary' },
        { text: '🔵 Milli Final (National Final)', value: 'national-final' },
        { text: '🏆 Böyük Final (Grand Final)', value: 'grand-final' },
      ],
    },
    note: 'Sayt parametrlərindəki "Hazırkı Tur" ilə uyğun gəldikdə bu element ana səhifədə böyük kart kimi göstərilir.',
    translations: [
      { language: 'az-AZ', translation: 'Müsabiqə Turu' },
      { language: 'en-US', translation: 'Contest Stage' },
    ],
  },
  schema: { default_value: 'preliminary' },
})

console.log('✓ gallery collection ready')

/* ───────────────────────── News ───────────────────────── */

await api('POST', '/collections', {
  collection: 'news',
  meta: {
    icon: 'campaign',
    note: '/news səhifəsində siyahı, hər biri üçün öz detal səhifəsi yaradılır. Ən yeni "Dərc Edilib" xəbər ana səhifədəki axar lentdə də göstərilir.',
    display_template: '{{title}}',
    sort_field: 'sort',
    translations: [
      { language: 'az-AZ', translation: 'Xəbərlər', singular: 'Xəbər', plural: 'Xəbərlər' },
      { language: 'en-US', translation: 'News', singular: 'News item', plural: 'News' },
    ],
  },
  schema: {},
  fields: [
    {
      field: 'id',
      type: 'integer',
      meta: { hidden: true, interface: 'input', readonly: true },
      schema: { is_primary_key: true, has_auto_increment: true },
    },
  ],
})

for (const field of [statusField, sortField]) {
  await api('POST', '/fields/news', field)
}

await api('POST', '/fields/news', {
  field: 'title',
  type: 'string',
  meta: {
    interface: 'input',
    width: 'full',
    required: true,
    options: { placeholder: 'Verbivore 2026 Böyük Finalı elan edildi' },
    translations: [
      { language: 'az-AZ', translation: 'Başlıq' },
      { language: 'en-US', translation: 'Title' },
    ],
  },
  schema: { is_nullable: false },
})

await api('POST', '/fields/news', {
  field: 'category',
  type: 'string',
  meta: {
    width: 'half',
    interface: 'select-dropdown',
    options: {
      choices: [
        { text: '📢 Elan', value: 'Announcement' },
        { text: '📅 Tədbir', value: 'Event' },
        { text: '🔔 Yenilik', value: 'Update' },
        { text: '📰 Mətbuat', value: 'Press' },
      ],
    },
    display: 'labels',
    note: '/news səhifəsində xəbərin üstündə rəngli, ikonlu etiket kimi göstərilir.',
    translations: [
      { language: 'az-AZ', translation: 'Kateqoriya' },
      { language: 'en-US', translation: 'Category' },
    ],
  },
  schema: { default_value: 'Announcement' },
})

await api('POST', '/fields/news', {
  field: 'date',
  type: 'date',
  meta: {
    width: 'half',
    interface: 'datetime',
    translations: [
      { language: 'az-AZ', translation: 'Nəşr Tarixi' },
      { language: 'en-US', translation: 'Published Date' },
    ],
  },
})

await api('POST', '/fields/news', {
  field: 'image',
  type: 'uuid',
  meta: {
    interface: 'file-image',
    special: ['file'],
    width: 'full',
    note: 'Xəbərlər siyahısında və detal səhifəsinin yuxarısında göstərilir.',
    translations: [
      { language: 'az-AZ', translation: 'Əsas Şəkil' },
      { language: 'en-US', translation: 'Cover Image' },
    ],
  },
})
await api('POST', '/relations', { collection: 'news', field: 'image', related_collection: 'directus_files' })

await api('POST', '/fields/news', {
  field: 'excerpt',
  type: 'text',
  meta: {
    interface: 'textarea',
    width: 'full',
    note: 'Xəbərlər siyahısında göstərilən qısa xülasə.',
    translations: [
      { language: 'az-AZ', translation: 'Qısa Xülasə' },
      { language: 'en-US', translation: 'Excerpt' },
    ],
  },
})

await api('POST', '/fields/news', {
  field: 'content',
  type: 'text',
  meta: {
    interface: 'input-rich-text-html',
    width: 'full',
    note: 'Məqalənin tam mətni (detal səhifəsində görünür). Vizual redaktor — kod bilmədən formatlaşdırma.',
    translations: [
      { language: 'az-AZ', translation: 'Tam Mətn' },
      { language: 'en-US', translation: 'Full Content' },
    ],
  },
})

await api('POST', '/fields/news', {
  field: 'ticker',
  type: 'string',
  meta: {
    interface: 'input',
    width: 'full',
    note: 'Axar lent üçün qısa mətn. Boş buraxılsa başlıq istifadə olunur.',
    translations: [
      { language: 'az-AZ', translation: 'Ana Səhifə Lent Mətni' },
      { language: 'en-US', translation: 'Homepage Ticker Text' },
    ],
  },
})

console.log('✓ news collection ready')

/* ───────────────────────── FAQ ───────────────────────── */

await api('POST', '/collections', {
  collection: 'faq',
  meta: {
    icon: 'quiz',
    note: '/faq səhifəsində göstərilir. Hər sual "Qrup" sahəsinə görə 3 başlıqdan birinin altına düşür, qrup daxilində "sort" sahəsinə görə (sürüşdürərək) düzülür.',
    display_template: '{{question}}',
    sort_field: 'sort',
    translations: [
      { language: 'az-AZ', translation: 'Tez-tez Soruşulan Suallar', singular: 'Sual', plural: 'Suallar' },
      { language: 'en-US', translation: 'FAQ', singular: 'Question', plural: 'Questions' },
    ],
  },
  schema: {},
  fields: [
    {
      field: 'id',
      type: 'integer',
      meta: { hidden: true, interface: 'input', readonly: true },
      schema: { is_primary_key: true, has_auto_increment: true },
    },
  ],
})

for (const field of [statusField, sortField]) {
  await api('POST', '/fields/faq', field)
}

await api('POST', '/fields/faq', {
  field: 'group',
  type: 'string',
  meta: {
    width: 'full',
    interface: 'select-dropdown',
    required: true,
    options: {
      choices: [
        { text: 'Şagirdlər və Valideynlər', value: 'Students & Parents' },
        { text: 'Məktəblər və Müəllimlər', value: 'Schools & Educators' },
        { text: 'Böyük Final və Buraxılışlar', value: 'Grand Final & Editions' },
      ],
    },
    note: 'Sualın /faq səhifəsində hansı başlıq altında göstəriləcəyini seçin.',
    translations: [
      { language: 'az-AZ', translation: 'Qrup' },
      { language: 'en-US', translation: 'Group' },
    ],
  },
  schema: { default_value: 'Students & Parents', is_nullable: false },
})

await api('POST', '/fields/faq', {
  field: 'question',
  type: 'string',
  meta: {
    interface: 'input',
    width: 'full',
    required: true,
    translations: [
      { language: 'az-AZ', translation: 'Sual' },
      { language: 'en-US', translation: 'Question' },
    ],
  },
  schema: { is_nullable: false },
})

await api('POST', '/fields/faq', {
  field: 'answer',
  type: 'text',
  meta: {
    interface: 'input-rich-text-html',
    width: 'full',
    required: true,
    translations: [
      { language: 'az-AZ', translation: 'Cavab' },
      { language: 'en-US', translation: 'Answer' },
    ],
  },
  schema: { is_nullable: false },
})

console.log('✓ faq collection ready')
