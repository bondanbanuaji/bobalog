import { google } from '@ai-sdk/google'
import { streamText, tool, convertToCoreMessages } from 'ai'
import { z } from 'zod'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export const maxDuration = 30

export async function POST(req: Request) {
  const { userId } = await auth()
  
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Graceful handling jika API key belum di-set
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return new Response(
      JSON.stringify({
        error: 'API Key belum dikonfigurasi. Silakan tambahkan GOOGLE_GENERATIVE_AI_API_KEY di .env.local',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { messages, image } = await req.json()

  const systemPrompt = `Kamu adalah Bobalog AI, AI assistant dari aplikasi wishlist Bobalog.

## Identitas
- Bisnis: Aplikasi cerdas penyimpan wishlist dan barang incaran e-commerce.
- Tone: Ramah, asik, santai tapi membantu. Pakai bahasa yang sama dengan user (Indonesia/Inggris).
- Panggilan: Panggil user dengan "Kak" (Indo) atau "you" (Inggris).

## Yang kamu bisa bantu
- Cek informasi barang yang ada di wishlist pengguna (prioritas, status, catatan).
- Cek daftar koleksi barang pengguna.
- Simpan barang incaran baru cukup dari link Shopee yang diberikan user.
- Kenali gambar barang yang dikirim user dan cocokkan dengan wishlist.

## Cara merespons
1. Selalu jawab ringkas dalam 2–4 kalimat dulu. Jangan langsung panjang lebar.
2. Gunakan emoji secukupnya biar asik.
3. Akhiri setiap respons dengan 1 pertanyaan lanjutan (misal: "Mau aku tunjukin barang yang prioritasnya MUST_BUY, Kak?").
4. Kalau tidak tahu atau data barang tidak ada, jujur saja.
5. Kalau user tampak kebingungan, tawarkan bantuan cara pakai fitur aplikasi ini.

## Deteksi intent & Proactive Suggestion
- User ngasih link Shopee → Langsung simpan pakai tool save_shopee_product, konfirmasi, lalu tawarkan apa mau difilter lagi.
- User nanya prioritas belanja → Cek wishlist mereka, sarankan barang dengan prioritas HIGH atau MUST_BUY untuk segera dibeli.
- User butuh bantuan teknis / manusia → Arahkan dengan sopan ke "support@bobalog.com".

## Batasan (PENTING)
- JANGAN bahas topik di luar konteks manajemen wishlist, e-commerce, belanja, dan Bobalog (misal: jangan jawab soal politik, cuaca, coding, atau matematika). Tolak dengan sopan.
- Jangan mengarang info produk jika memang tidak ada di database user.

## Knowledge base
- Bobalog adalah tempat pengguna menyimpan link Shopee, menata wishlist, dan melihat prioritas belanja agar tidak boros.
- Prioritas barang: LOW (bawah), NORMAL (biasa), HIGH (tinggi), MUST_BUY (wajib beli).
- Status barang: ACTIVE (aktif), BOUGHT (sudah dibeli), UNAVAILABLE (habis/tidak tersedia), ARCHIVED (diarsipkan).`

  const coreMessages = convertToCoreMessages(messages)

  // Inject image into the last user message if provided
  if (image && coreMessages.length > 0) {
    const lastMsg = coreMessages[coreMessages.length - 1]
    if (lastMsg.role === 'user') {
      const textContent = typeof lastMsg.content === 'string' ? lastMsg.content : ''
      // Extract base64 data from the data URL
      const base64Match = (image as string).match(/^data:(.+?);base64,(.+)$/)
      if (base64Match) {
        lastMsg.content = [
          { type: 'text', text: textContent || 'Apa ini?' },
          {
            type: 'image',
            image: Buffer.from(base64Match[2], 'base64'),
            mimeType: base64Match[1],
          } as any,
        ]
      }
    }
  }

  const result = await streamText({
    model: google('models/gemini-2.5-flash'),
    system: systemPrompt,
    messages: coreMessages,
    tools: {
      get_user_products: tool({
        description: 'Mendapatkan daftar produk yang disimpan oleh pengguna di Bobalog. Bisa difilter berdasarkan prioritas, status, atau pencarian nama.',
        parameters: z.object({
          search: z.string().optional().describe('Kata kunci pencarian pada judul atau catatan'),
          priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'MUST_BUY']).optional().describe('Filter berdasarkan prioritas'),
          status: z.enum(['ACTIVE', 'BOUGHT', 'UNAVAILABLE', 'ARCHIVED']).optional().describe('Filter berdasarkan status'),
        }),
        execute: async ({ search, priority, status }: { search?: string, priority?: string, status?: string }) => {
          const where: any = { userId }
          if (search) {
            where.OR = [
              { title: { contains: search, mode: 'insensitive' } },
              { notes: { contains: search, mode: 'insensitive' } }
            ]
          }
          if (priority) where.priority = priority
          if (status) where.status = status

          const products = await prisma.product.findMany({
            where,
            select: {
              id: true,
              title: true,
              priority: true,
              status: true,
              notes: true,
              shopeeUrl: true,
              createdAt: true
            },
            take: 20,
            orderBy: { createdAt: 'desc' }
          })
          return products
        },
      }),
      get_user_collections: tool({
        description: 'Mendapatkan daftar koleksi (folder/grup) yang dibuat oleh pengguna.',
        parameters: z.object({}),
        execute: async () => {
          const collections = await prisma.collection.findMany({
            where: { userId },
            select: {
              id: true,
              name: true,
              emoji: true,
              _count: {
                select: { products: true }
              }
            },
            orderBy: { sortOrder: 'asc' }
          })
          return collections
        },
      }),
      save_shopee_product: tool({
        description: 'Menyimpan produk baru ke dalam Bobalog ketika pengguna memberikan link Shopee.',
        parameters: z.object({
          url: z.string().url().describe('URL Shopee yang valid'),
          title: z.string().describe('Nama produk yang diekstrak dari URL slug Shopee'),
        }),
        execute: async ({ url, title }: { url: string, title: string }) => {
          const parsedUrl = new URL(url)
          const cleanUrl = parsedUrl.origin + parsedUrl.pathname

          const newProduct = await prisma.product.create({
            data: {
              userId,
              title,
              shopeeUrl: cleanUrl,
              priority: 'NORMAL',
              status: 'ACTIVE',
            }
          })

          return { success: true, message: 'Produk berhasil disimpan!', product: newProduct }
        },
      }),
    },
  })

  return result.toAIStreamResponse()
}
