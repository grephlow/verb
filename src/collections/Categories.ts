import type { CollectionConfig } from 'payload'
import { revalidateCategories } from '../lib/revalidate'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: { read: () => true },
  labels: { singular: 'Kateqoriya', plural: 'Kateqoriyalar' },
  hooks: {
    afterChange: [() => revalidateCategories()],
    afterDelete: [() => revalidateCategories()],
  },
  admin: {
    useAsTitle: 'name',
    group: '🏆 Müsabiqə',
    description: '/verbivore/categories səhifəsində kart kimi və "Slug" sahəsi vasitəsilə öz /verbivore/categories/[slug] səhifəsində (başlıq foto, video, akkordeon bölmələri ilə) göstərilir.',
    defaultColumns: ['name', 'gradeRange', 'ageRange', 'order'],
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Ad', admin: { placeholder: 'Junior A' } },
    { name: 'slug', type: 'text', required: true, unique: true, label: 'URL Slug', admin: { placeholder: 'junior-a', description: 'URL-də istifadə olunur: /verbivore/categories/{slug}. Kiçik hərf, yalnız defis.' } },
    {
      type: 'row',
      fields: [
        { name: 'gradeRange', type: 'text', label: 'Sinif Aralığı', admin: { placeholder: 'Grades 3–4', width: '50%' } },
        { name: 'ageRange',   type: 'text', label: 'Yaş Aralığı',   admin: { placeholder: 'Ages 9–10', width: '50%' } },
      ],
    },
    { name: 'color', type: 'text', label: 'Rəng (HEX)', defaultValue: '#ff821a', admin: { placeholder: '#ff821a', description: 'Kart fonunun qradient rəngi.' } },
    { name: 'description', type: 'textarea', label: 'Qısa Açıqlama', admin: { description: '/verbivore/categories səhifəsindəki kartda göstərilir.' } },
    {
      name: 'topics', type: 'array', label: 'Mövzular',
      admin: { description: 'Kartda kiçik etiketlər (tag) kimi göstərilir.' },
      fields: [
        { name: 'topic', type: 'text', required: true, label: 'Mövzu' },
      ],
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media', label: 'Başlıq Şəkli', admin: { description: '/verbivore/categories/[slug] səhifəsinin yuxarısında göstərilir.' } },
    { name: 'videoUrl', type: 'text', label: 'Video URL (istəyə bağlı)', admin: { placeholder: 'https://www.youtube.com/embed/...', description: 'YouTube/Vimeo embed keçidi və ya birbaşa video fayl URL-i.' } },
    {
      name: 'contentSections', type: 'array', label: 'Akkordeon Bölmələri',
      admin: { description: '/verbivore/categories/[slug] səhifəsində açılıb-bağlanan bölmələr kimi göstərilir.' },
      fields: [
        { name: 'icon',    type: 'text',     label: 'Emoji İkon', admin: { placeholder: '📝' } },
        { name: 'title',   type: 'text',     required: true, label: 'Başlıq' },
        { name: 'content', type: 'textarea', required: true, label: 'Məzmun', admin: { description: 'Sətir sonları dəstəklənir. • ilə başlayan hər sətir nöqtəyə çevrilir.' } },
      ],
    },
    { name: 'order', type: 'number', label: 'Sıra', defaultValue: 0 },
  ],
  defaultSort: 'order',
}
