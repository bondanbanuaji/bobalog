import { NextResponse } from 'next/server'
import { isShopeeUrl } from '@/lib/utils'

/**
 * Resolve shortlinks (id.shp.ee, shp.ee) to the full shopee.co.id URL
 * by following redirects manually so we can capture the final URL.
 */
async function resolveShopeeUrl(url: string): Promise<string> {
  // If it's already a full shopee.co.id URL, return as-is
  if (url.includes('shopee.co.id')) return url

  try {
    // Follow redirect manually to capture the final URL
    const res = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'WhatsApp/2.21.12.21 A',
      },
      redirect: 'follow',
    })
    const finalUrl = res.url

    // If the redirect resolved to a shopee.co.id URL, use it
    if (finalUrl && finalUrl.includes('shopee.co.id')) {
      return finalUrl
    }

    // Some shortlinks redirect through intermediate pages — try GET
    const getRes = await fetch(url, {
      headers: {
        'User-Agent': 'WhatsApp/2.21.12.21 A',
      },
      redirect: 'follow',
    })
    return getRes.url || url
  } catch {
    return url
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url || !isShopeeUrl(url)) {
      return NextResponse.json({ error: 'URL Shopee tidak valid' }, { status: 400 })
    }

    // Resolve shortlink to full URL
    const resolvedUrl = await resolveShopeeUrl(url)

    // Gunakan User-Agent WhatsApp agar Shopee mengembalikan meta tag Open Graph
    const response = await fetch(resolvedUrl, {
      headers: {
        'User-Agent': 'WhatsApp/2.21.12.21 A',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Gagal mengambil data dari Shopee' }, { status: 500 })
    }

    const html = await response.text()

    // Ekstrak meta tag menggunakan Regex
    const titleMatch = html.match(/<meta\s+(?:data-rh="true"\s+)?property="og:title"\s+content="([^"]+)"/i)
    const imageMatch = html.match(/<meta\s+(?:data-rh="true"\s+)?property="og:image"\s+content="([^"]+)"/i)
    const descMatch = html.match(/<meta\s+(?:data-rh="true"\s+)?name="description"\s+content="([^"]+)"/i)

    let title = titleMatch ? titleMatch[1] : ''
    let image = imageMatch ? imageMatch[1] : ''
    const description = descMatch ? descMatch[1] : ''

    // Bersihkan judul dari "Jual ... | Shopee Indonesia"
    if (title) {
      title = title.replace(/^Jual\s+/i, '').replace(/\s+\|\s+Shopee\s+Indonesia$/i, '')
    }

    // Jika gagal mendapat title dari meta tag, coba ambil dari URL path
    if (!title) {
      try {
        const urlObj = new URL(resolvedUrl)
        const pathParts = urlObj.pathname.split('/').filter(Boolean)
        if (pathParts.length > 0) {
          const slug = pathParts[0]
          // Ganti strip dengan spasi, hilangkan ID di akhir (-i.1234.5678)
          title = decodeURIComponent(slug).replace(/-i\.\d+\.\d+$/, '').replace(/-/g, ' ')
        }
      } catch (e) {
        // Abaikan error parsing URL fallback
      }
    }

    return NextResponse.json({
      title,
      image,
      description,
      resolvedUrl: resolvedUrl !== url ? resolvedUrl : undefined,
      success: true
    })

  } catch (error) {
    console.error('Shopee scrape error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan saat memproses URL' }, { status: 500 })
  }
}
