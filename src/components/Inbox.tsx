'use client'

import { useEffect, useState, useCallback } from 'react'
import { safeInboxLength, fetchInbox, addr as messageAddr } from '@/hooks/useMessages'
import AES from 'crypto-js/aes'
import Utf8 from 'crypto-js/enc-utf8'
import { useWatchContractEvent } from 'wagmi'
import { abi } from '@/contracts/ChatCoinMessage'
import { useQuery } from '@tanstack/react-query'
import { fetchProfile } from '@/hooks/useChatCoin'

interface Message {
  sender: string
  receiver: string
  cipher: string
  timestamp: bigint
}

export default function Inbox({ user }: { user: string | undefined }) {
  const [messages, setMessages] = useState<Message[]>([])

  const refetch = useCallback(async () => {
    if (!user) return
    const len = await safeInboxLength(user as `0x${string}`)
    const items: Message[] = []
    for (let i = 0n; i < len; i++) {
      const msg = (await fetchInbox(user, Number(i))) as any
      items.push(msg as Message)
    }
    setMessages(items)
  }, [user])

  useEffect(() => {
    refetch()
  }, [refetch, user])

  // Helper to shorten address
  const shortAddr = (addr: string) => addr.slice(0, 6) + '…' + addr.slice(-4)

  useWatchContractEvent({
    address: messageAddr,
    abi: abi as any,
    eventName: 'MessageSent',
    listener(logs: any[]) {
      logs.forEach((l: any) => {
        if (l.args?.receiver?.toLowerCase() === user?.toLowerCase()) {
          refetch()
        }
      })
    },
    enabled: !!user,
  } as any)

  if (!user) return null

  return (
    <div className="mt-6 p-4 border rounded bg-gray-800 max-w-md flex flex-col gap-3">
      <h3 className="text-xl font-semibold">Inbox</h3>
      {messages.length === 0 ? (
        <p className="text-gray-400">Your inbox is empty.</p>
      ) : (
        <div className="flex flex-col space-y-3">
          {messages.map((m, idx) => (
            <MessageItem key={idx} msg={m} currentUser={user} shortAddr={shortAddr} />
          ))}
        </div>
      )}
    </div>
  )
}

function MessageItem({ msg, currentUser, shortAddr }: { msg: any; currentUser: string; shortAddr: (a:string)=>string }) {
  const { data: profile } = useQuery({
    queryKey: ['profile', msg.sender],
    queryFn: () => fetchProfile(msg.sender as `0x${string}`) as any,
    enabled: !!msg.sender,
  }) as { data: any }

  const hasUsername = profile && (profile as any).username
  const senderLine = hasUsername
    ? `from ${(profile as any).username} (${shortAddr(msg.sender)})`
    : `from ${shortAddr(msg.sender)}`

  return (
    <div className="p-3 border rounded bg-gray-900">
      <p className="text-sm text-gray-400">{senderLine}</p>
      <p className="text-base text-white mt-1">{(() => {
        try {
          const key = currentUser.slice(2, 18)
          const plain = AES.decrypt(msg.cipher, key).toString(Utf8)
          return plain || '[decrypt fail]'
        } catch {
          return '[decrypt error]'
        }
      })()}</p>
    </div>
  )
} 