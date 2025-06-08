import { writeContract, readContract } from '@wagmi/core'
import { abi } from '@/contracts/ChatCoinMessage'
import { wagmiConfig } from '@/lib/wagmi'

export const addr = process.env.NEXT_PUBLIC_MESSAGE_ADDRESS as `0x${string}`

export const sendMessage = (receiver: string, cipher: string) =>
  // @ts-ignore
  writeContract(wagmiConfig, { address: addr, abi: abi as any, functionName: 'sendMessage', args: [receiver, cipher] })

export const inboxLength = (user: string) =>
  // @ts-ignore
  readContract(wagmiConfig, { address: addr, abi: abi as any, functionName: 'inboxLength', args: [user] })

export const safeInboxLength = async (user: `0x${string}`) => {
  try {
    return (await inboxLength(user)) as bigint
  } catch {
    return 0n
  }
}

export const fetchInbox = (user: string, i: number) =>
  // @ts-ignore
  readContract(wagmiConfig, { address: addr, abi: abi as any, functionName: 'getMessage', args: [user, BigInt(i)] }) 