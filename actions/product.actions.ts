'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { Priority, ProductStatus, ScrapeStatus } from '@/types'
import { revalidatePath } from 'next/cache'

export async function getProducts(filters?: {
  status?: ProductStatus
  priority?: Priority
  scrapeStatus?: ScrapeStatus
  collectionId?: string
  tagId?: string
  search?: string
  sortBy?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'name'
}) {
  const { userId } = await auth()
  if (!userId) return []

  const where: any = { userId }

  if (filters?.status) where.status = filters.status
  if (filters?.priority) where.priority = filters.priority
  if (filters?.scrapeStatus) where.scrapeStatus = filters.scrapeStatus

  if (filters?.collectionId) {
    where.collections = {
      some: {
        collectionId: filters.collectionId,
      },
    }
  }

  if (filters?.tagId) {
    where.tags = {
      some: {
        tagId: filters.tagId,
      },
    }
  }

  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { shopName: { contains: filters.search, mode: 'insensitive' } },
      { notes: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  let orderBy: any = { createdAt: 'desc' }
  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'price_asc':
        orderBy = { price: 'asc' }
        break
      case 'price_desc':
        orderBy = { price: 'desc' }
        break
      case 'name':
        orderBy = { title: 'asc' }
        break
    }
  }

  try {
    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        priceHistory: {
          orderBy: { checkedAt: 'desc' },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })
    return products as any[]
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function saveProduct(data: {
  shopeeUrl: string
  title: string
  price: number
  notes?: string
  collectionId?: string
  shopeeProductId?: string
}) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  try {
    const product = await prisma.$transaction(async (tx: any) => {
      // 1. Create product
      const newProduct = await tx.product.create({
        data: {
          userId,
          shopeeUrl: data.shopeeUrl,
          shopeeProductId: data.shopeeProductId,
          title: data.title,
          price: data.price,
          notes: data.notes,
          priority: Priority.NORMAL,
          status: ProductStatus.ACTIVE,
          scrapeStatus: ScrapeStatus.BASIC, // Manual entries start with basic metadata
        },
      })

      // 2. Add to price history
      await tx.priceHistory.create({
        data: {
          productId: newProduct.id,
          price: data.price,
        },
      })

      // 3. Add to collection if specified
      if (data.collectionId) {
        await tx.collectionProduct.create({
          data: {
            collectionId: data.collectionId,
            productId: newProduct.id,
          },
        })
      }

      return newProduct
    })

    revalidatePath('/')
    if (data.collectionId) {
      revalidatePath(`/collections/${data.collectionId}`)
    }

    return { success: true, product }
  } catch (error: any) {
    console.error('Error saving product:', error)
    return { success: false, error: error.message || 'Gagal menyimpan produk' }
  }
}

export async function updateProduct(
  id: string,
  data: {
    notes?: string
    priority?: Priority
    status?: ProductStatus
    tags?: string[] // tag names
  }
) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  try {
    const updated = await prisma.$transaction(async (tx: any) => {
      const product = await tx.product.findUnique({
        where: { id },
        select: { userId: true },
      })

      if (!product || product.userId !== userId) {
        throw new Error('Produk tidak ditemukan atau tidak diizinkan')
      }

      const updateData: any = {}
      if (data.notes !== undefined) updateData.notes = data.notes
      if (data.priority !== undefined) updateData.priority = data.priority
      if (data.status !== undefined) updateData.status = data.status

      const updatedProduct = await tx.product.update({
        where: { id },
        data: updateData,
      })

      // If tags are provided, update them
      if (data.tags !== undefined) {
        // Delete old tag relations
        await tx.productTag.deleteMany({
          where: { productId: id },
        })

        // Find or create tags, then link them
        for (const tagName of data.tags) {
          const formattedName = tagName.trim()
          if (!formattedName) continue

          let tag = await tx.tag.findFirst({
            where: { userId, name: { equals: formattedName, mode: 'insensitive' } },
          })

          if (!tag) {
            tag = await tx.tag.create({
              data: {
                userId,
                name: formattedName,
                color: getRandomTagColor(),
              },
            })
          }

          await tx.productTag.create({
            data: {
              productId: id,
              tagId: tag.id,
            },
          })
        }
      }

      return updatedProduct
    })

    revalidatePath('/')
    return { success: true, product: updated }
  } catch (error: any) {
    console.error('Error updating product:', error)
    return { success: false, error: error.message || 'Gagal memperbarui produk' }
  }
}

export async function deleteProduct(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!product || product.userId !== userId) {
      throw new Error('Produk tidak ditemukan atau tidak diizinkan')
    }

    await prisma.product.delete({
      where: { id },
    })

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return { success: false, error: error.message || 'Gagal menghapus produk' }
  }
}

export async function toggleArchive(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { userId: true, status: true },
    })

    if (!product || product.userId !== userId) {
      throw new Error('Produk tidak ditemukan atau tidak diizinkan')
    }

    const nextStatus =
      product.status === ProductStatus.ARCHIVED
        ? ProductStatus.ACTIVE
        : ProductStatus.ARCHIVED

    const updated = await prisma.product.update({
      where: { id },
      data: { status: nextStatus },
    })

    revalidatePath('/')
    return { success: true, product: updated }
  } catch (error: any) {
    console.error('Error archiving product:', error)
    return { success: false, error: error.message || 'Gagal mengubah status produk' }
  }
}

function getRandomTagColor() {
  const colors = ['#9b7fe8', '#c4a882', '#f29cc4', '#7bcfa0', '#64b5f6']
  return colors[Math.floor(Math.random() * colors.length)]
}
