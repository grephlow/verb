import type { CollectionConfig } from 'payload'
import { revalidateFaq } from '../lib/revalidate'

export const FAQ: CollectionConfig = {
  access: { read: () => true },
  slug: 'faq',
  hooks: {
    afterChange: [() => revalidateFaq()],
    afterDelete: [() => revalidateFaq()],
  },
  labels: { singular: 'Sual', plural: 'Tez-tez Soruşulan Suallar' },
  admin: {
    useAsTitle: 'question',
    group: '🏆 Müsabiqə',
    description: '/faq səhifəsində göstərilir. Hər sual aşağıdakı "Qrup" sahəsinə görə 3 başlıqdan birinin altına düşür, qrup daxilində isə "Sıra" sahəsinə görə düzülür.',
    defaultColumns: ['question', 'group', 'order'],
  },
  fields: [
    {
      name: 'group',
      type: 'select',
      label: 'Qrup',
      required: true,
      admin: {
        description: 'Sualın /faq səhifəsində hansı başlıq altında göstəriləcəyini seçin (3 sabit başlıqdan biri).',
      },
      options: [
        { label: 'Şagirdlər və Valideynlər', value: 'Students & Parents' },
        { label: 'Məktəblər və Müəllimlər', value: 'Schools & Educators' },
        { label: 'Böyük Final və Buraxılışlar', value: 'Grand Final & Editions' },
      ],
      defaultValue: 'Students & Parents',
    },
    {
      name: 'question',
      type: 'text',
      label: 'Sual',
      required: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      label: 'Cavab',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      label: 'Sıra',
      defaultValue: 0,
      admin: {
        description: 'Eyni qrup daxilində sıralama: kiçik rəqəm = daha yuxarıda.',
      },
    },
  ],
  defaultSort: 'order',
}
