import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bobalog — Katalog Shopee Pribadimu',
    short_name: 'Bobalog',
    description: 'Simpan dulu, beli nanti. Organisir wishlist Shopee kamu dengan koleksi cerdas dan tampilan katalog yang cantik.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d0c0e',
    theme_color: '#0d0c0e',
    icons: [
      {
        src: '/icon/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
