import { NextRequest, NextResponse } from 'next/server'
import { uploadFile } from '@/lib/ipfs'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'File missing' }, { status: 400 })

  try {
    const url = await uploadFile(file)
    return NextResponse.json({ url })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
} 