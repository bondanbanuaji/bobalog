'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function getTags() {
  const { userId } = await auth()
  if (!userId) return []

  try {
    const tags = await prisma.tag.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    })
    return tags
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

export async function createTag(data: { name: string; color?: string }) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  try {
    const existing = await prisma.tag.findFirst({
      where: { userId, name: { equals: data.name.trim(), mode: 'insensitive' } },
    })

    if (existing) {
      return { success: true, tag: existing }
    }

    const tag = await prisma.tag.create({
      data: {
        userId,
        name: data.name.trim(),
        color: data.color || '#9b7fe8',
      },
    })

    return { success: true, tag }
  } catch (error: any) {
    console.error('Error creating tag:', error)
    return { success: false, error: error.message || 'Gagal membuat tag' }
  }
}
