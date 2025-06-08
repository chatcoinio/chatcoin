'use client'

import { fetchOwner } from '@/hooks/useChatCoin'
// @ts-ignore
import { useAccount, useReadContract } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'
import ProfileForm from '@/components/ProfileForm'
import ProfileCard from '@/components/ProfileCard'
import { abi } from '@/contracts/ChatCoinProfile'
import MessageForm from '@/components/MessageForm'
import Inbox from '@/components/Inbox'

export default function Home() {
  const { address, isConnected } = useAccount()

  const contractAddress = process.env.NEXT_PUBLIC_PROFILE_ADDRESS as `0x${string}` | undefined

  const { data: owner } = useQuery({
    queryKey: ['owner'],
    queryFn: fetchOwner,
    enabled: !!contractAddress,
  })

  const { data: profile, refetch: refetchProfile } = useReadContract({
    address: contractAddress as `0x${string}` | undefined,
    abi: abi as typeof abi,
    functionName: 'getProfile',
    args: [address as `0x${string}` | undefined],
    query: { enabled: !!isConnected && !!address && !!contractAddress },
  }) as { data: any; refetch: () => void }

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="w-full mx-auto max-w-2xl flex flex-col gap-6 p-6 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to ChatCoin</h1>
      <ConnectButton />

      {isConnected ? (
        <>
          <p className="mt-4">Your address: {address}</p>
          <p className="mt-1">Contract Owner: {String(owner)}</p>

          <ProfileForm refetchProfile={refetchProfile} />

          {profile && profile.username && (
            <ProfileCard profile={profile} refetchProfile={refetchProfile} />
          )}

          {/* Messaging */}
          <MessageForm myAddress={address} />
          <Inbox user={address} />
        </>
      ) : (
        <p className="mt-4">Please connect your wallet</p>
      )}
    </main>
  )
}
