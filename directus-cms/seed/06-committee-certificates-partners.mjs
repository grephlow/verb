// "committee", "certificates", "partners" — straightforward collections with
// a relation to "countries" (committee, certificates) and "editions" (certificates).

import {
  api, createCollection, addFields, addRelations, setPublicRead,
  strField, textareaField, intField, boolField, selectField, m2oField, fileField, relationDef,
} from './_lib.mjs'

/* ── Committee ──────────────────────────────────────────────────── */
await createCollection('committee', {
  icon: 'groups',
  note: '/verbivore/scientific-committee səhifəsində göstərilir. "Komitə Sədridir" işarələnən üzvlər səhifənin yuxarısında ayrıca, böyük "Sədr" kartında çıxır.',
  display_template: '{{name}}',
  translations: [
    { language: 'az-AZ', translation: 'Elmi Komitə', singular: 'Komitə Üzvü', plural: 'Komitə Üzvləri' },
    { language: 'en-US', translation: 'Committee', singular: 'Committee Member', plural: 'Committee Members' },
  ],
})
await addFields('committee', [
  strField('name', 'Ad Soyad', { required: true }),
  strField('organization', 'Təmsil Etdiyi Qurum', { placeholder: 'University of Cambridge' }),
  strField('title', 'Elmi Dərəcə / Vəzifə', { required: true, placeholder: 'Prof. Dr. / PhD ...' }),
  m2oField('country', 'Ölkə', { required: true, note: 'Üzvün təmsil etdiyi ölkə. Bayraq avtomatik ölkə məlumatından götürülür.' }),
  boolField('isChair', 'Komitə Sədridir', { note: 'İşarələnsə, üzv səhifənin yuxarısında ayrıca, böyük "Sədr" kartında göstəriləcək.' }),
  textareaField('bio', 'Bioqrafiya'),
  fileField('photo', 'Foto', { note: 'Üzvün portret fotosu (isteğe bağlı).' }),
  intField('order', 'Sıra', { note: 'Sədrlər əvvəl (məs. 0), sonra üzvlər sıraya görə.' }),
])
await addRelations([
  relationDef('committee', 'country', 'countries'),
  relationDef('committee', 'photo', 'directus_files'),
])

/* ── Certificates ───────────────────────────────────────────────── */
await createCollection('certificates', {
  icon: 'workspace_premium',
  note: 'Saytda siyahı kimi göstərilmir. /certificate-verify səhifəsində istifadəçi "Sertifikat Kodu"nu daxil edib axtarır.',
  display_template: '{{code}}',
  sort_field: null,
  translations: [
    { language: 'az-AZ', translation: 'Sertifikatlar', singular: 'Sertifikat', plural: 'Sertifikatlar' },
    { language: 'en-US', translation: 'Certificates', singular: 'Certificate', plural: 'Certificates' },
  ],
})
await addFields('certificates', [
  { ...strField('code', 'Sertifikat Kodu', { required: true, placeholder: 'VERB-2026-AZ-001', note: 'Sertifikatda çap olunan unikal kod. Format: VERB-İL-ÖL-###' }), schema: { is_nullable: false, is_unique: true } },
  strField('nameSurname', 'Ad Soyad', { required: true }),
  m2oField('country', 'Ölkə', { required: true, note: 'Bayraq avtomatik ölkə məlumatından götürülür.' }),
  m2oField('edition', 'Buraxılış', { template: '{{shortTitle}}', note: 'Bu sertifikatın verildiyi müsabiqə buraxılışı (məs. 2026 UK).' }),
  strField('grade', 'Sinif', { width: 'half', placeholder: '7' }),
  strField('examDate', 'İmtahan Tarixi', { width: 'half', placeholder: '15 Avq 2026' }),
  strField('score', 'Bal', { width: 'half', placeholder: '94/100' }),
  strField('achievement', 'Nailiyyət', { width: 'half', placeholder: '🥇 Qızıl Medal' }),
  selectField('examType', 'İmtahan Növü', [
    { text: 'Böyük Final', value: 'Grand Final' },
    { text: 'Milli Final', value: 'National Final' },
    { text: 'İlkin Tur', value: 'Preliminary Round' },
  ], { width: 'full', defaultValue: 'Grand Final' }),
])
await addRelations([
  relationDef('certificates', 'country', 'countries'),
  relationDef('certificates', 'edition', 'editions'),
])

/* ── Partners ───────────────────────────────────────────────────── */
await createCollection('partners', {
  icon: 'handshake',
  note: 'Ana səhifənin "Partners" bölməsində loqo kartları kimi göstərilir, "Sıra" sahəsinə görə düzülür.',
  display_template: '{{name}}',
  translations: [
    { language: 'az-AZ', translation: 'Tərəfdaşlar', singular: 'Tərəfdaş', plural: 'Tərəfdaşlar' },
    { language: 'en-US', translation: 'Partners', singular: 'Partner', plural: 'Partners' },
  ],
})
await addFields('partners', [
  strField('name', 'Ad', { required: true }),
  fileField('logo', 'Loqo', { note: 'Tərəfdaş loqo şəkli.' }),
  strField('websiteUrl', 'Vebsayt URL', { placeholder: 'https://...' }),
  selectField('tier', 'Səviyyə', [
    { text: '🥇 Qızıl', value: 'Gold' },
    { text: '🥈 Gümüş', value: 'Silver' },
    { text: '🎓 Akademik', value: 'Academic' },
    { text: '📺 Media', value: 'Media' },
    { text: '💻 Texnologiya', value: 'Technology' },
  ], { width: 'full', defaultValue: 'Academic', note: 'Loqonun altında kiçik etiket kimi göstərilir.' }),
  intField('order', 'Sıra'),
])
await addRelations([
  relationDef('partners', 'logo', 'directus_files'),
])

await setPublicRead(['committee', 'certificates', 'partners'])
console.log('✓ committee, certificates, partners collections ready')
