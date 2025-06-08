declare module 'web3.storage' {
  export class Web3Storage {
    constructor(opts: { token: string })
    put(files: File[], options?: { wrapWithDirectory?: boolean }): Promise<string>
  }
} 