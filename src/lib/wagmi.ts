import { createConfig, http } from 'wagmi'
import { hardhat } from 'wagmi/chains'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'

export const chains = [hardhat] as const

const { connectors } = getDefaultWallets({
  appName: 'ChatCoin',
  projectId: 'chatcoin-project',
})

export const wagmiConfig = createConfig({
  connectors,
  chains,
  transports: { [hardhat.id]: http('http://127.0.0.1:8545') } as const,
}) 