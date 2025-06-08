'use client'

import { useState } from 'react'
import { sendMessage } from '@/hooks/useMessages'
import { toast } from 'react-hot-toast'
import AES from 'crypto-js/aes'
import { useQueryClient } from '@tanstack/react-query'

interface Props {
  myAddress: string | undefined
}

export default function MessageForm({ myAddress }: Props) {
  const [receiver, setReceiver] = useState('')
  const [plain, setPlain] = useState('')
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!receiver || !plain) return
    const key = receiver.slice(2, 18) // 16-byte key derived from address
    const cipher = AES.encrypt(plain, key).toString()
    setLoading(true)
    const toastId = (toast as any).loading('Sending message…')
    try {
      await sendMessage(receiver, cipher)
      // refresh inbox queries
      queryClient.invalidateQueries()
      ;(toast as any).success('Message sent!', { id: toastId })
      setPlain('')
      setReceiver('')
    } catch (_) {
      ;(toast as any).error('Message failed to send.', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6 p-4 border rounded bg-gray-800 max-w-md">
      <h3 className="text-xl font-semibold mb-3">Send Message</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="p-2 text-black rounded w-full"
          placeholder="e.g. 0xAbc...1234"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          autoFocus
        />
        <textarea
          className="p-2 text-black rounded w-full"
          placeholder="Write your message..."
          rows={3}
          value={plain}
          onChange={(e) => setPlain(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-green-600 rounded text-white disabled:opacity-60"
        >
          {loading ? 'Sending…' : 'Send'}
        </button>
      </form>
    </div>
  )
} 