'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from 'ai/react'
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, Check, Image as ImageIcon } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
  })

  const { addProduct } = useUIStore()
  const endOfMessagesRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const processedToolsRef = useRef<Set<string>>(new Set())

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() && !selectedImage) return

    handleSubmit(e, {
      options: {
        body: selectedImage ? { image: selectedImage } : undefined,
      },
    })
    setSelectedImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    
    // Watch for successful save_shopee_product tool calls
    messages.forEach(m => {
      m.toolInvocations?.forEach(tool => {
        if ('result' in tool && tool.toolName === 'save_shopee_product' && tool.result?.product) {
          if (!processedToolsRef.current.has(tool.toolCallId)) {
            processedToolsRef.current.add(tool.toolCallId)
            addProduct(tool.result.product)
          }
        }
      })
    })
  }, [messages, isLoading, addProduct])

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-colors ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} bg-boba hover:bg-boba-hover text-white`}
      >
        <Sparkles size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[600px] max-h-[80vh] flex flex-col bg-bg-base border border-[var(--color-glass-border)] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="h-16 px-4 bg-bg-surface/80 backdrop-blur-md border-b border-[var(--color-glass-border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-boba/20 flex items-center justify-center">
                  <Bot size={18} className="text-boba" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Bobalog AI</h3>
                  <p className="text-[10px] text-text-muted">Asisten Wishlist Pintar</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-[var(--color-glass-bg-hover)] text-text-muted transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-50">
                  <Sparkles size={32} className="text-boba" />
                  <p className="text-sm">Halo! Saya Bobalog AI. Tanyakan apa saja tentang produk yang kamu simpan.</p>
                </div>
              )}
              
              {messages.map(m => (
                <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-bg-surface border border-[var(--color-glass-border)]' : 'bg-boba/20'}`}>
                    {m.role === 'user' ? <User size={14} className="text-text-secondary" /> : <Bot size={14} className="text-boba" />}
                  </div>
                  <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-boba text-white rounded-tr-sm' : 'bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)] text-text-primary rounded-tl-sm'}`}>
                    {m.content}
                    
                    {/* Handle Tool Calls visualization (optional) */}
                    {m.toolInvocations && m.toolInvocations.map(tool => (
                      <div key={tool.toolCallId} className="mt-2 p-2 bg-black/10 dark:bg-black/20 rounded-lg text-xs font-mono opacity-70">
                        {'result' in tool ? (
                          <div className="flex items-center gap-1 text-green-500">
                            <Check size={12} /> Data ditemukan
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Loader2 size={12} className="animate-spin" /> Sedang mencari data...
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-500">
                  Terjadi kesalahan: {error.message}
                </div>
              )}
              
              <div ref={endOfMessagesRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-bg-surface/50 border-t border-[var(--color-glass-border)]">
              {selectedImage && (
                <div className="mb-2 relative inline-block">
                  <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-[var(--color-glass-border)]" />
                  <button 
                    onClick={() => { setSelectedImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                  >
                    <X size={10} />
                  </button>
                </div>
              )}
              <form onSubmit={onSubmit} className="relative flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-text-muted hover:text-text-primary hover:bg-[var(--color-glass-bg-hover)] rounded-lg transition-colors flex-shrink-0"
                  disabled={isLoading}
                >
                  <ImageIcon size={18} />
                </button>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleImageChange} 
                />
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ketik pertanyaan atau taruh link Shopee..."
                  className="w-full pl-4 pr-12 h-12 rounded-xl bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)] text-sm focus:outline-none focus:border-boba transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={(!input.trim() && !selectedImage) || isLoading}
                  className="absolute right-2 p-2 bg-boba hover:bg-boba-hover text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
