import type { CollectionConfig } from 'payload'

export const PreliminaryResources: CollectionConfig = {
  slug: 'preliminary-resources',
  access: { read: () => true },
  labels: { singular: 'Resurs', plural: 'Resurslar' },
  admin: {
    useAsTitle: 'title',
    group: '🏆 Müsabiqə',
    description: '"Mərhələ" sahəsinə görə /verbivore/preliminary-round (Preliminary Round) və ya /verbivore/national-final (National Final) səhifəsində göstərilir; bütün resurslar həmçinin /verbivore/sample-questions səhifəsində birlikdə görünür. Hər səhifədə "Mərhələ Adı" üzrə bölmələrə, sonra "Kateqoriya"ya görə alt-bölmələrə qruplaşır. "Resurs Növü" seçin — yalnız ona aid sahələr görünəcək.',
    defaultColumns: ['stage', 'type', 'roundLabel', 'category', 'country', 'title', 'order'],
  },
  fields: [
    {
      name: 'stage',
      type: 'select',
      required: true,
      label: 'Mərhələ',
      defaultValue: 'preliminary',
      options: [
        { label: 'Preliminary Round', value: 'preliminary' },
        { label: 'National Final', value: 'national-final' },
        { label: 'Grand Final', value: 'grand-final' },
      ],
      admin: { description: 'Resursun /verbivore/preliminary-round (Preliminary Round) yoxsa /verbivore/national-final (National Final) səhifəsində göstəriləcəyini müəyyən edir.' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Resurs Növü',
      options: [
        { label: 'Nümunə Sual', value: 'sample-question' },
        { label: 'Sillabus', value: 'syllabus' },
        { label: 'Nəticə', value: 'result' },
      ],
      admin: { description: 'Növə görə aşağıdakı sahələr dəyişəcək.' },
    },
    {
      name: 'roundLabel',
      type: 'text',
      required: true,
      label: 'Mərhələ Adı',
      admin: { placeholder: 'Preliminary Round / İlkin seçim', description: 'Səhifədə bölmə başlığı kimi göstərilir. Eyni adı yazan resurslar eyni bölmədə birləşir.' },
    },
    {
      name: 'roundIcon',
      type: 'text',
      label: 'Mərhələ İkonu (emoji)',
      defaultValue: '📋',
      admin: { description: 'Bölmə başlığının yanında göstərilir.' },
    },
    {
      name: 'category',
      type: 'text',
      label: 'Kateqoriya',
      admin: {
        placeholder: 'Kiçik A',
        description: 'Bölmə daxilində alt-başlıq kimi göstərilir (eyni adlı resurslar bir yerə yığılır).',
        condition: (_, siblingData) => siblingData?.type === 'sample-question' || siblingData?.type === 'syllabus',
      },
    },
    {
      name: 'grade',
      type: 'text',
      label: 'Sinif Aralığı',
      admin: {
        placeholder: '3–4-cü sinif',
        condition: (_, siblingData) => siblingData?.type === 'sample-question' || siblingData?.type === 'syllabus',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Fayl Başlığı',
      admin: {
        placeholder: 'Nümunə sual 1',
        condition: (_, siblingData) => siblingData?.type === 'sample-question' || siblingData?.type === 'syllabus',
      },
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      label: 'Ölkə',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'result',
      },
    },
    {
      name: 'countryMeta',
      type: 'text',
      label: 'Ölkə Açıqlaması',
      defaultValue: 'Preliminary Round results PDF',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'result',
      },
    },
    {
      name: 'pdfUrl',
      type: 'text',
      required: true,
      label: 'PDF URL',
      admin: { placeholder: 'https://...', description: '"Yüklə" / "Bax" düyməsinin keçid ünvanı.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Sıra',
    },
  ],
}
