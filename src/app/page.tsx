'use client'

import { useChatCoin } from '@/hooks/useChatCoin'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { register, owner } = useChatCoin()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="p-10 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to ChatCoin</h1>
      <ConnectButton />

      {isConnected ? (
        <>
          <p className="mt-4">Your address: {address}</p>
          <p className="mt-1">Contract Owner: {String(owner)}</p>

          <button
            className="mt-6 px-6 py-2 bg-blue-500 rounded text-white font-bold"
            onClick={() => register?.()}
          >
            Register Profile
          </button>
        </>
      ) : (
        <p className="mt-4">Please connect your wallet</p>
      )}
    </main>
  )
}
