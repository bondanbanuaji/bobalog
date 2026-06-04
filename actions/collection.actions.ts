'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function getCollections() {
  const { userId } = await auth()
  if (!userId) return []

  try {
    const collections = await prisma.collection.findMany({
      where: { userId },
      orderBy: { sortOrder: 'asc' },
      include: {
        products: {
          orderBy: { sortOrder: 'asc' },
          include: {
            product: {
              include: {
                tags: {
                  include: {
                    tag: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return collections.map((col: any) => ({
      id: col.id,
      userId: col.userId,
      name: col.name,
      description: col.description || undefined,
      emoji: col.emoji || undefined,
      color: col.color || undefined,
      isPublic: col.isPublic,
      shareToken: col.shareToken || undefined,
      sortOrder: col.sortOrder,
      productCount: col.products.length,
      products: col.products.map((cp: any) => ({
        ...cp.product,
        // Ensure dates are stringified/serialized or kept as dates
        createdAt: cp.product.createdAt,
        updatedAt: cp.product.updatedAt,
      })),
      createdAt: col.createdAt,
      updatedAt: col.updatedAt,
    }))
  } catch (error) {
    console.error('Error fetching collections:', error)
    return []
  }
}

export async function getCollectionDetail(id: string) {
  const { userId } = await auth()
  if (!userId) return null

  try {
    const col = await prisma.collection.findFirst({
      where: { id, userId },
      include: {
        products: {
          orderBy: { sortOrder: 'asc' },
          include: {
            product: {
              include: {
                tags: {
                  include: {
                    tag: true,
                  },
                },

              },
            },
          },
        },
      },
    })

    if (!col) return null

    return {
      id: col.id,
      userId: col.userId,
      name: col.name,
      description: col.description || undefined,
      emoji: col.emoji || undefined,
      color: col.color || undefined,
      isPublic: col.isPublic,
      shareToken: col.shareToken || undefined,
      sortOrder: col.sortOrder,
      productCount: col.products.length,
      products: col.products.map((cp: any) => ({
        ...cp.product,

        tags: cp.product.tags,
      })),
      createdAt: col.createdAt,
      updatedAt: col.updatedAt,
    }
  } catch (error) {
    console.error('Error fetching collection detail:', error)
    return null
  }
}

export async function createCollection(data: {
  name: string
  description?: string
  emoji?: string
  color?: string
  isPublic?: boolean
}) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  try {
    const col = await prisma.collection.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        emoji: data.emoji || '📁',
        color: data.color || '#c4a882',
        isPublic: data.isPublic || false,
      },
    })

    revalidatePath('/collections')
    return { success: true, collection: col }
  } catch (error: any) {
    console.error('Error creating collection:', error)
    return { success: false, error: error.message || 'Gagal membuat koleksi' }
  }
}

export async function updateCollection(
  id: string,
  data: {
    name?: string
    description?: string
    emoji?: string
    color?: string
    isPublic?: boolean
  }
) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  try {
    const check = await prisma.collection.findFirst({
      where: { id, userId },
    })

    if (!check) throw new Error('Koleksi tidak ditemukan')

    const updated = await prisma.collection.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        emoji: data.emoji,
        color: data.color,
        isPublic: data.isPublic,
      },
    })

    revalidatePath('/collections')
    revalidatePath(`/collections/${id}`)
    return { success: true, collection: updated }
  } catch (error: any) {
    console.error('Error updating collection:', error)
    return { success: false, error: error.message || 'Gagal memperbarui koleksi' }
  }
}

export async function deleteCollection(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  try {
    const check = await prisma.collection.findFirst({
      where: { id, userId },
    })

    if (!check) throw new Error('Koleksi tidak ditemukan')

    await prisma.collection.delete({
      where: { id },
    })

    revalidatePath('/collections')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting collection:', error)
    return { success: false, error: error.message || 'Gagal menghapus koleksi' }
  }
}
