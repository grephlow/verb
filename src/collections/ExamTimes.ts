import type { CollectionConfig } from 'payload'
import { revalidateExamTimes } from '../lib/revalidate'

export const ExamTimes: CollectionConfig = {
  access: { read: () => true },
  slug: 'exam-times',
  hooks: {
    afterChange: [() => revalidateExamTimes()],
    afterDelete: [() => revalidateExamTimes()],
  },
  labels: { singular: 'İmtahan Vaxtı', plural: 'İmtahan Vaxtları' },
  admin: {
    useAsTitle: 'country',
    group: '🏆 Müsabiqə',
    description: '/verbivore/exam-time səhifəsində tam cədvəl kimi, ana səhifədə isə "Sıra" sahəsinə görə ilk 4 qeyd qısa siyahı (teaser) şəklində göstərilir. İl seçimi (year) səhifədəki il filterinə görə qeydləri ayırır.',
    defaultColumns: ['country', 'year', 'round', 'date', 'status'],
  },
  fields: [
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      required: true,
      label: 'Ölkə',
      admin: { description: 'Bayraq avtomatik ölkə məlumatından götürülür.' },
    },
    { name: 'year', type: 'number', required: true, defaultValue: 2026, label: 'İl', admin: { description: 'Bu qeydin aid olduğu təqvim ili. /verbivore/exam-time səhifəsindəki il seçicisi bu sahəyə görə filtrlənir.' } },
    { name: 'round', type: 'text', label: 'Tur', admin: { placeholder: 'İlkin Tur' } },
    { name: 'date', type: 'text', label: 'Tarix', admin: { placeholder: '27 Sen 2026' } },
    { name: 'time', type: 'text', label: 'Vaxt', admin: { placeholder: '10:00 yerli vaxt' } },
    { name: 'venue', type: 'text', label: 'Məkan' },
    { name: 'participants', type: 'text', label: 'İştirakçılar' },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: '✅ Təsdiqlənib', value: 'Confirmed' },
        { label: '⏳ Dəqiqləşdiriləcək', value: 'TBC' },
        { label: '🏆 Böyük Final', value: 'Grand Final' },
      ],
      defaultValue: 'TBC',
      admin: { description: 'Cədvəldə sətirin sağında etiket kimi göstərilir.' },
    },
    { name: 'order', type: 'number', label: 'Sıra', defaultValue: 0, admin: { description: 'Cədvəldə sıralama və ana səhifə teaser-i üçün ilk 4 qeydin seçimi bu sahəyə görə olur.' } },
  ],
  defaultSort: 'order',
}
