'use client'

import { useState, useEffect } from 'react'
import { useReadContract, useWriteContract } from 'wagmi'
import { readContract } from '@wagmi/core'
import { abi } from '@/contracts/ChatCoinProfile'
import { wagmiConfig } from '@/lib/wagmi'

const contractAddress = process.env.NEXT_PUBLIC_PROFILE_ADDRESS as `0x${string}` | undefined
if (!contractAddress) {
  console.error('NEXT_PUBLIC_PROFILE_ADDRESS environment variable is not defined')
}

export const fetchOwner = () =>
  readContract(wagmiConfig, {
    address: contractAddress as any,
    abi: abi as any,
    functionName: 'owner',
    args: [],
  })

export const fetchProfile = (addr: `0x${string}`) => {
  if (!contractAddress) {
    return Promise.resolve(null)
  }
  return readContract(wagmiConfig, {
    address: contractAddress as any,
    abi: abi as any,
    functionName: 'getProfile',
    args: [addr],
  })
}

export function useChatCoin() {
  const [owner, setOwner] = useState<string | null>(null)
  const { data: ownerData } = useReadContract({
    address: contractAddress as `0x${string}` | undefined,
    abi: abi as typeof abi,
    functionName: 'owner',
  })

  const { writeContract } = useWriteContract()

  /**
   * Register a profile on-chain.
   * Returns the promise from wagmi so callers can await.
   */
  const register = (
    username: string,
    avatarUrl: string,
    bio: string
  ) => {
    if (!contractAddress) {
      return Promise.reject(
        new Error('NEXT_PUBLIC_PROFILE_ADDRESS environment variable is not defined')
      )
    }
    if (!username.trim()) {
      return Promise.reject(new Error('Username is required'))
    }

    return writeContract({
      address: contractAddress as `0x${string}`,
      abi: abi as typeof abi,
      functionName: 'register',
      args: [username, avatarUrl, bio],
    })
  }

  /**
   * Update avatar URL and bio for the caller.
   */
  const updateProfile = (avatarUrl: string, bio: string) => {
    if (!contractAddress) {
      return Promise.reject(new Error('NEXT_PUBLIC_PROFILE_ADDRESS environment variable is not defined'))
    }
    return writeContract({
      address: contractAddress as `0x${string}`,
      abi: abi as typeof abi,
      functionName: 'updateProfile',
      args: [avatarUrl, bio],
    })
  }

  useEffect(() => {
    if (ownerData) {
      setOwner(ownerData as string)
    }
  }, [ownerData])

  return {
    owner,
    register,
    updateProfile,
    fetchOwner,
    fetchProfile,
  }
}
