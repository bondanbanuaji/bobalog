'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function getScrapeJobs() {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Unauthorized' }

  try {
    const jobs = await prisma.scrapeJob.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    })
    return { success: true, jobs }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to fetch scrape jobs' }
  }
}

export async function createScrapeJob(url: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Unauthorized' }

  try {
    const job = await prisma.scrapeJob.create({
      data: {
        userId,
        targetUrl: url,
        status: 'PENDING'
      }
    })
    
    revalidatePath('/scraping')
    return { success: true, job }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to create scrape job' }
  }
}
