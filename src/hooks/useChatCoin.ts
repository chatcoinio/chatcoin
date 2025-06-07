'use client'

import { useState, useEffect } from 'react'
import { useReadContract, useWriteContract } from 'wagmi'
import { abi } from '@/contracts/ChatCoinProfile'

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3' // ✅ your deployed address

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
