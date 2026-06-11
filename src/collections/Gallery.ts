import type { CollectionConfig } from 'payload'
import { revalidateGallery } from '../lib/revalidate'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  access: { read: () => true },
  labels: { singular: 'Qalereya', plural: 'Qalereyalar' },
  admin: {
    group: '🏠 Əsas Səhifə',
    useAsTitle: 'title',
    description: 'Əsas səhifənin qalereyasında göstərilən şəkillər. Birinci element (sıraya görə) böyük kart olur.',
    defaultColumns: ['title', 'tag', 'order'],
  },
  hooks: {
    afterChange: [() => revalidateGallery()],
    afterDelete: [() => revalidateGallery()],
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Şəkil',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Başlıq',
      admin: { placeholder: 'Beynəlxalq şagird təcrübəsi' },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Alt Başlıq',
      admin: { placeholder: 'Kartda göstərilən qısa açıqlama.' },
    },
    {
      name: 'tag',
      type: 'text',
      label: 'Etiket',
      defaultValue: 'Foto',
      admin: { description: 'Nişan kimi göstərilən etiket: "Foto", "Video", "Seçilmiş Media" və s.' },
    },
    {
      name: 'stage',
      type: 'select',
      label: 'Müsabiqə Turu',
      defaultValue: 'preliminary',
      options: [
        { label: '🟠 İlkin Seçim (Preliminary Round)', value: 'preliminary' },
        { label: '🔵 Milli Final (National Final)',     value: 'national-final' },
        { label: '🏆 Böyük Final (Grand Final)',        value: 'grand-final' },
      ],
      admin: { description: 'Sayt parametrlərindəki "Hazırkı Tur" ilə uyğun gəldikdə bu foto göstərilir.' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Sıra',
      defaultValue: 0,
      admin: { description: 'Az = əvvəldə.' },
    },
  ],
  defaultSort: 'order',
}
