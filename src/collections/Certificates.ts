import type { CollectionConfig } from 'payload'

export const Certificates: CollectionConfig = {
  slug: 'certificates',
  access: { read: () => true },
  labels: { singular: 'Sertifikat', plural: 'Sertifikatlar' },
  admin: {
    useAsTitle: 'code',
    group: '🏆 Müsabiqə',
    description: 'Saytda siyahı kimi göstərilmir. /certificate-verify səhifəsində istifadəçi "Sertifikat Kodu"nu daxil edib axtarır — kod tapılarsa, aşağıdakı bütün sahələr (ad, ölkə, sinif, tarix, bal, nailiyyət) həmin şəxsə nəticə kimi göstərilir.',
    defaultColumns: ['code', 'nameSurname', 'country', 'achievement', 'examType', 'examDate'],
  },
  fields: [
    { name: 'code', type: 'text', required: true, unique: true, label: 'Sertifikat Kodu', admin: { placeholder: 'VERB-2026-AZ-001', description: 'Sertifikatda çap olunan unikal kod. Format: VERB-İL-ÖL-###' } },
    { name: 'nameSurname', type: 'text', required: true, label: 'Ad Soyad' },
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      required: true,
      label: 'Ölkə',
      admin: { description: 'Bayraq avtomatik ölkə məlumatından götürülür.' },
    },
    {
      name: 'edition',
      type: 'relationship',
      relationTo: 'editions',
      label: 'Buraxılış',
      admin: { description: 'Bu sertifikatın verildiyi müsabiqə buraxılışı (məs. 2026 UK).' },
    },
    { name: 'grade', type: 'text', label: 'Sinif', admin: { placeholder: '7' } },
    { name: 'examDate', type: 'text', label: 'İmtahan Tarixi', admin: { placeholder: '15 Avq 2026' } },
    { name: 'score', type: 'text', label: 'Bal', admin: { placeholder: '94/100' } },
    { name: 'achievement', type: 'text', label: 'Nailiyyət', admin: { placeholder: '🥇 Qızıl Medal' } },
    {
      name: 'examType',
      type: 'select',
      label: 'İmtahan Növü',
      options: [
        { label: 'Böyük Final', value: 'Grand Final' },
        { label: 'Milli Final', value: 'National Final' },
        { label: 'İlkin Tur', value: 'Preliminary Round' },
      ],
      defaultValue: 'Grand Final',
    },
  ],
}
