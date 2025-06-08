import { Web3Storage } from 'web3.storage'

const client = new Web3Storage({
  token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN as string,
})

export async function uploadFile(file: File): Promise<string> {
  const cid = await client.put([file], { wrapWithDirectory: false })
  return `https://${cid}.ipfs.dweb.link`
} 