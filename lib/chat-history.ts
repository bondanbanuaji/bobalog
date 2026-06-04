import fs from 'fs/promises'
import path from 'path'
import { Message } from 'ai'

const CHATS_DIR = path.join(process.cwd(), '.bobalog_data', 'chats')

async function ensureDir() {
  try {
    await fs.access(CHATS_DIR)
  } catch {
    await fs.mkdir(CHATS_DIR, { recursive: true })
  }
}

export async function getChatHistory(userId: string): Promise<Message[]> {
  await ensureDir()
  const filePath = path.join(CHATS_DIR, `${userId}.json`)
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data) as Message[]
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return []
    }
    console.error('Error reading chat history:', error)
    return []
  }
}

export async function saveChatHistory(userId: string, messages: Message[]): Promise<void> {
  await ensureDir()
  const filePath = path.join(CHATS_DIR, `${userId}.json`)
  try {
    await fs.writeFile(filePath, JSON.stringify(messages, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error saving chat history:', error)
  }
}
