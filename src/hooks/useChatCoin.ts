'use client'

import { useState, useEffect } from 'react'
import { useReadContract, useWriteContract } from 'wagmi'
import { abi } from '@/contracts/ChatCoinProfile'

const contractAddress = process.env.NEXT_PUBLIC_PROFILE_ADDRESS
if (!contractAddress) {
  console.error('NEXT_PUBLIC_PROFILE_ADDRESS environment variable is not defined')
}

export function useChatCoin() {
  const [owner, setOwner] = useState<string | null>(null)
  const { data: ownerData } = useReadContract({
    address: contractAddress,
    abi: abi as typeof abi,
    functionName: 'owner',
  })

  const { writeContract } = useWriteContract()

  const register = () => {
    writeContract({
      address: contractAddress,
      abi: abi as typeof abi,
      functionName: 'mintProfile',
      args: [],
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
  }
}
