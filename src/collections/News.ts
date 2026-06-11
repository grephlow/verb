import type { CollectionConfig } from 'payload'
import { revalidateNews } from '../lib/revalidate'

export const News: CollectionConfig = {
  slug: 'news',
  access: { read: () => true },
  labels: { singular: 'Xəbər', plural: 'Xəbərlər' },
  admin: {
    useAsTitle: 'text',
    group: '📰 Xəbərlər',
    description: '/news səhifəsində siyahı, hər biri üçün isə öz /news/[id] detal səhifəsi yaradılır. Ən yeni xəbər ana səhifənin yuxarısındakı axar lentdə (ticker) də göstərilir. Yalnız "Dərc Edilib" işarələnmiş xəbərlər saytda görünür.',
    defaultColumns: ['text', 'category', 'date', 'published', 'order'],
  },
  hooks: {
    afterChange: [() => revalidateNews()],
    afterDelete: [() => revalidateNews()],
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
      label: 'Başlıq',
      admin: { placeholder: 'Verbivore 2026 Böyük Finalı elan edildi' },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Kateqoriya',
      options: [
        { label: '📢 Elan', value: 'Announcement' },
        { label: '📅 Tədbir', value: 'Event' },
        { label: '🔔 Yenilik', value: 'Update' },
        { label: '📰 Mətbuat', value: 'Press' },
      ],
      defaultValue: 'Announcement',
      admin: { description: '/news səhifəsində xəbərin üstündə rəngli, ikonlu etiket kimi göstərilir.' },
    },
    {
      name: 'date',
      type: 'text',
      label: 'Nəşr Tarixi',
      admin: { placeholder: '27 May 2026', description: 'Olduğu kimi göstərilir.' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Əsas Şəkil',
      admin: { description: 'Xəbərlər siyahısında və detal səhifəsinin yuxarısında göstərilir.' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Qısa Xülasə',
      admin: { description: 'Xəbərlər siyahısında göstərilən qısa xülasə.' },
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'Tam Mətn',
      admin: { description: 'Məqalənin tam mətni (detal səhifəsində görünür).' },
    },
    {
      name: 'ticker',
      type: 'text',
      label: 'Ana Səhifə Lent Mətni',
      admin: { description: 'Axar lent üçün qısa mətn. Boş buraxılsa başlıq istifadə olunur.' },
    },
    {
      name: 'published',
      type: 'checkbox',
      label: 'Dərc Edilib',
      defaultValue: true,
      admin: { description: 'İctimai xəbərlər səhifəsindən gizlətmək üçün işarəni çıxarın.' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Sıra',
      defaultValue: 0,
      admin: { description: 'Az = əvvəldə.' },
    },
  ],
  defaultSort: '-createdAt',
}
