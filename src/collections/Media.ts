import type { CollectionConfig } from 'payload'
import path from 'path'
import { revalidateMedia } from '../lib/revalidate'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  hooks: {
    afterChange: [() => revalidateMedia()],
    afterDelete: [() => revalidateMedia()],
  },
  labels: { singular: 'Fayl', plural: 'Fayllar' },
  admin: {
    group: '🖼 Fayllar',
    description: 'Bütün yüklənmiş şəkillər buraya düşür. Birbaşa bura fayl yükləməyə ehtiyac yoxdur — şəkil seçən hər sahədə (Xəbərlər, Qalereya, Buraxılışlar, Komitə fotoları və s.) "Yüklə" düyməsi ilə birbaşa şəkil əlavə edə bilərsiniz, o avtomatik bura əlavə olunur.',
    defaultColumns: ['filename', 'mimeType', 'filesize', 'createdAt'],
  },
  upload: {
    staticDir: path.join(process.cwd(), 'public/uploads'),
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 320,
        height: 240,
        position: 'centre',
      },
      {
        name: 'card',
        width: 640,
        height: 480,
        position: 'centre',
      },
    ],
    mimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
      'image/svg+xml',
      'image/tiff',
      'image/bmp',
      'image/heic',
      'image/heif',
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Mətn',
      admin: { description: 'Əlçatımlılıq və SEO üçün şəkli təsvir edin.' },
    },
  ],
}
