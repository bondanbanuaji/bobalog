import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getChatHistory } from '@/lib/chat-history'

export async function GET() {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const history = await getChatHistory(userId)
    return NextResponse.json(history)
  } catch (error) {
    console.error('Error fetching chat history:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}
