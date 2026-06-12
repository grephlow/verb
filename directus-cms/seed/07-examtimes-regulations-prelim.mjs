// "exam_times", "regulations", "preliminary_resources"

import {
  api, createCollection, addFields, addRelations, setPublicRead,
  strField, emojiField, textareaField, intField, selectField, m2oField, relationDef,
} from './_lib.mjs'

/* ── Exam Times ─────────────────────────────────────────────────── */
await createCollection('exam_times', {
  icon: 'schedule',
  note: '/verbivore/exam-time səhifəsində tam cədvəl kimi, ana səhifədə isə "Sıra" sahəsinə görə ilk 4 qeyd qısa siyahı (teaser) şəklində göstərilir.',
  display_template: '{{countryFlag}} {{countryName}} — {{round}}',
  translations: [
    { language: 'az-AZ', translation: 'İmtahan Vaxtları', singular: 'İmtahan Vaxtı', plural: 'İmtahan Vaxtları' },
    { language: 'en-US', translation: 'Exam Times', singular: 'Exam Time', plural: 'Exam Times' },
  ],
})
await addFields('exam_times', [
  m2oField('country', 'Ölkə', { required: true, note: 'Bayraq avtomatik ölkə məlumatından götürülür.' }),
  intField('year', 'İl', { width: 'half', defaultValue: 2026, required: true, note: 'Bu qeydin aid olduğu təqvim ili.' }),
  strField('round', 'Tur', { width: 'half', placeholder: 'İlkin Tur' }),
  strField('date', 'Tarix', { width: 'half', placeholder: '27 Sen 2026' }),
  strField('time', 'Vaxt', { width: 'half', placeholder: '10:00 yerli vaxt' }),
  strField('venue', 'Məkan', { width: 'half' }),
  strField('participants', 'İştirakçılar', { width: 'half' }),
  selectField('status', 'Status', [
    { text: '✅ Təsdiqlənib', value: 'Confirmed' },
    { text: '⏳ Dəqiqləşdiriləcək', value: 'TBC' },
    { text: '🏆 Böyük Final', value: 'Grand Final' },
  ], { width: 'full', defaultValue: 'TBC', note: 'Cədvəldə sətirin sağında etiket kimi göstərilir.' }),
  intField('order', 'Sıra', { note: 'Cədvəldə sıralama və ana səhifə teaser-i üçün ilk 4 qeydin seçimi bu sahəyə görə olur.' }),
])
await addRelations([relationDef('exam_times', 'country', 'countries')])

/* ── Regulations ────────────────────────────────────────────────── */
await createCollection('regulations', {
  icon: 'gavel',
  note: '/verbivore/regulations səhifəsində akkordeon bölmələr kimi göstərilir, "Sıra" sahəsinə görə düzülür.',
  display_template: '{{title}}',
  translations: [
    { language: 'az-AZ', translation: 'Qaydalar', singular: 'Qayda', plural: 'Qaydalar' },
    { language: 'en-US', translation: 'Regulations', singular: 'Regulation', plural: 'Regulations' },
  ],
})
await addFields('regulations', [
  strField('title', 'Başlıq', { required: true, note: 'Akkordeon bölməsinin başlıq sətrində ikonun yanında göstərilir.' }),
  emojiField('icon', 'Emoji İkon', { width: 'half', placeholder: '📋', note: 'Akkordeon başlığının solunda göstərilir.' }),
  textareaField('content', 'Məzmun', { required: true, note: 'Akkordeon açılanda görünən mətn. Siyahı yaratmaq üçün • işarəsindən istifadə edin.' }),
  intField('order', 'Sıra', { note: 'Bölmələrin səhifədə yuxarıdan-aşağı sırası: kiçik rəqəm = daha yuxarıda.' }),
])

/* ── Preliminary Resources ──────────────────────────────────────── */
await createCollection('preliminary_resources', {
  icon: 'folder_open',
  note: '"Mərhələ" sahəsinə görə /verbivore/preliminary-round və ya /verbivore/national-final səhifəsində göstərilir; bütün resurslar həmçinin /verbivore/sample-questions səhifəsində görünür.',
  display_template: '{{title}}',
  translations: [
    { language: 'az-AZ', translation: 'Resurslar', singular: 'Resurs', plural: 'Resurslar' },
    { language: 'en-US', translation: 'Resources', singular: 'Resource', plural: 'Resources' },
  ],
})
await addFields('preliminary_resources', [
  selectField('stage', 'Mərhələ', [
    { text: 'Preliminary Round', value: 'preliminary' },
    { text: 'National Final', value: 'national-final' },
    { text: 'Grand Final', value: 'grand-final' },
  ], { width: 'full', required: true, defaultValue: 'preliminary', note: 'Resursun hansı səhifədə göstəriləcəyini müəyyən edir.' }),
  selectField('type', 'Resurs Növü', [
    { text: 'Nümunə Sual', value: 'sample-question' },
    { text: 'Sillabus', value: 'syllabus' },
    { text: 'Nəticə', value: 'result' },
  ], { width: 'full', required: true, note: 'Növə görə aşağıdakı sahələr dəyişəcək.' }),
  strField('roundLabel', 'Mərhələ Adı', { required: true, placeholder: 'Preliminary Round / İlkin seçim', note: 'Səhifədə bölmə başlığı kimi göstərilir.' }),
  emojiField('roundIcon', 'Mərhələ İkonu (emoji)', { width: 'half', defaultValue: '📋', note: 'Bölmə başlığının yanında göstərilir.' }),
  {
    ...strField('category', 'Kateqoriya', { placeholder: 'Kiçik A', note: 'Bölmə daxilində alt-başlıq kimi göstərilir.' }),
    meta: {
      interface: 'input', width: 'half', options: { placeholder: 'Kiçik A' },
      note: 'Bölmə daxilində alt-başlıq kimi göstərilir.',
      translations: [{ language: 'az-AZ', translation: 'Kateqoriya' }],
      hidden: true,
      conditions: [{ name: 'Nümunə Sual/Sillabus üçün göstər', rule: { _or: [{ type: { _eq: 'sample-question' } }, { type: { _eq: 'syllabus' } }] }, hidden: false }],
    },
  },
  {
    ...strField('grade', 'Sinif Aralığı', { placeholder: '3–4-cü sinif' }),
    meta: {
      interface: 'input', width: 'half', options: { placeholder: '3–4-cü sinif' },
      translations: [{ language: 'az-AZ', translation: 'Sinif Aralığı' }],
      hidden: true,
      conditions: [{ name: 'Nümunə Sual/Sillabus üçün göstər', rule: { _or: [{ type: { _eq: 'sample-question' } }, { type: { _eq: 'syllabus' } }] }, hidden: false }],
    },
  },
  {
    ...strField('title', 'Fayl Başlığı', { placeholder: 'Nümunə sual 1' }),
    meta: {
      interface: 'input', width: 'full', options: { placeholder: 'Nümunə sual 1' },
      translations: [{ language: 'az-AZ', translation: 'Fayl Başlığı' }],
      hidden: true,
      conditions: [{ name: 'Nümunə Sual/Sillabus üçün göstər', rule: { _or: [{ type: { _eq: 'sample-question' } }, { type: { _eq: 'syllabus' } }] }, hidden: false }],
    },
  },
  {
    ...m2oField('country', 'Ölkə', {}),
    meta: {
      ...m2oField('country', 'Ölkə', {}).meta,
      hidden: true,
      conditions: [{ name: 'Nəticə üçün göstər', rule: { type: { _eq: 'result' } }, hidden: false }],
    },
  },
  {
    ...strField('countryMeta', 'Ölkə Açıqlaması', { defaultValue: 'Preliminary Round results PDF' }),
    meta: {
      interface: 'input', width: 'full', translations: [{ language: 'az-AZ', translation: 'Ölkə Açıqlaması' }],
      hidden: true,
      conditions: [{ name: 'Nəticə üçün göstər', rule: { type: { _eq: 'result' } }, hidden: false }],
    },
  },
  strField('pdfUrl', 'PDF URL', { required: true, placeholder: 'https://...', note: '"Yüklə" / "Bax" düyməsinin keçid ünvanı.' }),
  intField('order', 'Sıra'),
])
await addRelations([relationDef('preliminary_resources', 'country', 'countries')])

await setPublicRead(['exam_times', 'regulations', 'preliminary_resources'])
console.log('✓ exam_times, regulations, preliminary_resources collections ready')
