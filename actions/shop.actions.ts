'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function getShops() {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Unauthorized' }

  try {
    const shops = await prisma.shop.findMany({
      where: { userId },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { totalSales: 'desc' }
    })
    
    return { success: true, shops }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to fetch shops' }
  }
}

export async function upsertShop(data: { name: string, url?: string, username?: string }) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Unauthorized' }

  try {
    const shop = await prisma.shop.upsert({
      where: {
        userId_name: {
          userId,
          name: data.name
        }
      },
      update: {
        url: data.url,
        username: data.username
      },
      create: {
        userId,
        name: data.name,
        url: data.url,
        username: data.username
      }
    })
    
    revalidatePath('/shops')
    return { success: true, shop }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to upsert shop' }
  }
}
