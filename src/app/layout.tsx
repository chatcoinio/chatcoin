'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { hardhat } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

const inter = Inter({ subsets: ['latin'] })

const { connectors } = getDefaultWallets({
  appName: 'ChatCoin',
  projectId: 'chatcoin-project',
})

const config = createConfig({
  connectors,
  chains: [hardhat],
  transports: {
    [hardhat.id]: http(),
  },
})

const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider initialChain={hardhat}>
              {children}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  )
}
