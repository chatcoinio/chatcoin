declare module 'react-hot-toast' {
  import { ReactNode } from 'react'
  export function toast(msg: string): void
  export function success(msg: string): void
  export function error(msg: string): void
  export function promise<T>(promise: Promise<T>, msgs: { loading: string; success: string; error: string | ((err: unknown) => string) }): Promise<T>
  export const Toaster: (props: { position?: string }) => ReactNode
  export default {
    toast,
    success,
    error,
    promise,
    Toaster,
  }
} 