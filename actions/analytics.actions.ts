'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function getAnalyticsSummary() {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Unauthorized' }

  try {
    // We can fetch real aggregations here instead of computing on client
    const totalProducts = await prisma.product.count({ where: { userId } })
    const totalShops = await prisma.shop.count({ where: { userId } })
    const totalCategories = await prisma.collection.count({ where: { userId } })
    
    const outOfStock = await prisma.product.count({
      where: { userId, stock: 0 }
    })

    return { 
      success: true, 
      stats: {
        totalProducts,
        totalShops,
        totalCategories,
        outOfStock
      }
    }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to fetch analytics' }
  }
}
