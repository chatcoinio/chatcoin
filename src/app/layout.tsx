'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { WagmiConfig } from 'wagmi'
import { wagmiConfig, chains } from '@/lib/wagmi'
import { sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

const inter = Inter({ subsets: ['latin'] })

const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>ChatCoin</title>
        <meta name="description" content="ChatCoin – Decentralized profiles and messaging" />
      </head>
      <body className={inter.className}>
        <header className="text-center py-4 text-lg font-semibold" tabIndex={-1}>ChatCoin</header>
        <WagmiConfig config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider initialChain={sepolia} modalSize="compact">
              {children}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}
