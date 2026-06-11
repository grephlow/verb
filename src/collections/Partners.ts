import type { CollectionConfig } from 'payload'
import { revalidatePartners } from '../lib/revalidate'

export const Partners: CollectionConfig = {
  access: { read: () => true },
  slug: 'partners',
  hooks: {
    afterChange: [() => revalidatePartners()],
    afterDelete: [() => revalidatePartners()],
  },
  labels: { singular: 'Tərəfdaş', plural: 'Tərəfdaşlar' },
  admin: {
    useAsTitle: 'name',
    group: '🤝 Tərəfdaşlar',
    description: 'Ana səhifənin "Partners" bölməsində loqo kartları kimi göstərilir, "Sıra" sahəsinə görə düzülür.',
    defaultColumns: ['name', 'tier', 'websiteUrl', 'order'],
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Ad' },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Loqo',
      admin: { description: 'Tərəfdaş loqo şəkli.' },
    },
    { name: 'websiteUrl', type: 'text', label: 'Vebsayt URL', admin: { placeholder: 'https://...' } },
    {
      name: 'tier',
      type: 'select',
      label: 'Səviyyə',
      options: [
        { label: '🥇 Qızıl', value: 'Gold' },
        { label: '🥈 Gümüş', value: 'Silver' },
        { label: '🎓 Akademik', value: 'Academic' },
        { label: '📺 Media', value: 'Media' },
        { label: '💻 Texnologiya', value: 'Technology' },
      ],
      defaultValue: 'Academic',
      admin: { description: 'Loqonun altında kiçik etiket kimi göstərilir.' },
    },
    { name: 'order', type: 'number', label: 'Sıra', defaultValue: 0 },
  ],
  defaultSort: 'order',
}
