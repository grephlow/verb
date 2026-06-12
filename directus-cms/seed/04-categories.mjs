// "categories" collection — /verbivore/categories cards + /verbivore/categories/[slug] detail pages.

import { api, createCollection, addFields, addRelations, setPublicRead, strField, textareaField, intField, fileField, relationDef, listField, subField, emojiSubField } from './_lib.mjs'

await createCollection('categories', {
  icon: 'category',
  note: '/verbivore/categories səhifəsində kart kimi və "Slug" sahəsi vasitəsilə öz /verbivore/categories/[slug] səhifəsində (başlıq foto, video, akkordeon bölmələri ilə) göstərilir.',
  display_template: '{{name}}',
  translations: [
    { language: 'az-AZ', translation: 'Kateqoriyalar', singular: 'Kateqoriya', plural: 'Kateqoriyalar' },
    { language: 'en-US', translation: 'Categories', singular: 'Category', plural: 'Categories' },
  ],
})

await addFields('categories', [
  strField('name', 'Ad', { required: true, placeholder: 'Junior A' }),
  { ...strField('slug', 'URL Slug', { required: true, placeholder: 'junior-a', note: 'URL-də istifadə olunur: /verbivore/categories/{slug}. Kiçik hərf, yalnız defis.' }), schema: { is_nullable: false, is_unique: true } },
  strField('gradeRange', 'Sinif Aralığı', { width: 'half', placeholder: 'Grades 3–4' }),
  strField('ageRange', 'Yaş Aralığı', { width: 'half', placeholder: 'Ages 9–10' }),
  strField('color', 'Rəng (HEX)', { width: 'half', placeholder: '#ff821a', defaultValue: '#ff821a', note: 'Kart fonunun qradient rəngi.' }),
  textareaField('description', 'Qısa Açıqlama', { note: '/verbivore/categories səhifəsindəki kartda göstərilir.' }),
  listField('topics', 'Mövzular', [
    subField('topic', 'Mövzu', 'string'),
  ], { template: '{{topic}}', note: 'Kartda kiçik etiketlər (tag) kimi göstərilir.' }),
  fileField('coverImage', 'Başlıq Şəkli', { note: '/verbivore/categories/[slug] səhifəsinin yuxarısında göstərilir.' }),
  strField('videoUrl', 'Video URL (istəyə bağlı)', { placeholder: 'https://www.youtube.com/embed/...', note: 'YouTube/Vimeo embed keçidi və ya birbaşa video fayl URL-i.' }),
  listField('contentSections', 'Akkordeon Bölmələri', [
    emojiSubField('icon', 'Emoji İkon'),
    subField('title', 'Başlıq', 'string'),
    subField('content', 'Məzmun', 'text'),
  ], { template: '{{title}}', note: '/verbivore/categories/[slug] səhifəsində açılıb-bağlanan bölmələr kimi göstərilir.' }),
  intField('order', 'Sıra'),
])

await addRelations([
  relationDef('categories', 'coverImage', 'directus_files'),
])

await setPublicRead(['categories'])
console.log('✓ categories collection ready')
