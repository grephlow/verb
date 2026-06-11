import type { CollectionConfig } from 'payload'
import { revalidateRegulations } from '../lib/revalidate'

export const Regulations: CollectionConfig = {
  access: { read: () => true },
  slug: 'regulations',
  hooks: {
    afterChange: [() => revalidateRegulations()],
    afterDelete: [() => revalidateRegulations()],
  },
  labels: { singular: 'Qayda', plural: 'Qaydalar' },
  admin: {
    useAsTitle: 'title',
    group: '🏆 Müsabiqə',
    description: '/verbivore/regulations səhifəsində akkordeon (klikləyəndə açılıb-bağlanan) bölmələr kimi göstərilir, "Sıra" sahəsinə görə düzülür.',
    defaultColumns: ['title', 'icon', 'order'],
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Başlıq', admin: { description: 'Akkordeon bölməsinin başlıq sətrində ikonun yanında göstərilir.' } },
    { name: 'icon', type: 'text', label: 'Emoji İkon', admin: { placeholder: '📋', description: 'Akkordeon başlığının solunda göstərilir.' } },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Məzmun',
      admin: { description: 'Akkordeon açılanda görünən mətn. Siyahı yaratmaq üçün • işarəsindən istifadə edin.' },
    },
    { name: 'order', type: 'number', label: 'Sıra', defaultValue: 0, admin: { description: 'Bölmələrin səhifədə yuxarıdan-aşağı sırası: kiçik rəqəm = daha yuxarıda.' } },
  ],
  defaultSort: 'order',
}
