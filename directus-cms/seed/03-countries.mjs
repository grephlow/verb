// "countries" collection — referenced by certificates, committee, exam_times,
// preliminary_resources and editions (hostCountry).

import { api, createCollection, addFields, setPublicRead, strField, emojiField, selectField, textareaField, intField } from './_lib.mjs'

await createCollection('countries', {
  icon: 'flag',
  note: '/verbivore/countries-territories səhifəsində cədvəl şəklində göstərilir. Hər sətirdə bayraq, ölkə adı, status (rəngli etiket) və nümayəndə görünür.',
  display_template: '{{flag}} {{name}}',
  translations: [
    { language: 'az-AZ', translation: 'Ölkələr', singular: 'Ölkə', plural: 'Ölkələr' },
    { language: 'en-US', translation: 'Countries', singular: 'Country', plural: 'Countries' },
  ],
})

await addFields('countries', [
  strField('name', 'Ölkə Adı', { required: true }),
  emojiField('flag', 'Bayraq Emoji', { placeholder: '🇦🇿', width: 'half', note: 'Bayraq emojisini birbaşa yazın, yapıştırın və ya emoji seçicisindən seçin.' }),
  selectField('status', 'Status', [
    { text: 'Aktiv', value: 'Active' },
    { text: 'Müşahidəçi', value: 'Observer' },
    { text: 'Gözləmədə', value: 'Pending' },
  ], { width: 'half', defaultValue: 'Active', note: 'Cədvəldə ölkə adının yanında rəngli nöqtə/etiket kimi göstərilir.' }),
  strField('accreditedOrganization', 'Akkreditə Olunmuş Təşkilat', { note: 'Bu ölkəni rəsmi olaraq təmsil edən akkreditə olunmuş təşkilatın adı.' }),
  strField('representative', 'Nümayəndə (şəxs)', { note: 'Əlaqə üçün məsul şəxsin adı (istəyə bağlı).' }),
  strField('website', 'Vebsayt URL', { placeholder: 'https://example.org' }),
  textareaField('notes', 'Qeydlər'),
  intField('order', 'Sıra'),
])

await setPublicRead(['countries'])
console.log('✓ countries collection ready')
