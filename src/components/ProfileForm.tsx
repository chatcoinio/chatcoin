'use client'

import { useState } from 'react'
import { useChatCoin } from '@/hooks/useChatCoin'
import { toast } from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'

interface Props {
  refetchProfile?: () => void
}

export default function ProfileForm({ refetchProfile }: Props) {
  const { register } = useChatCoin()
  const queryClient = useQueryClient()

  const [username, setUsername] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [bio, setBio] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) return // simple validation

    try {
      setIsSubmitting(true)

      let finalAvatarUrl = ''
      if (avatarFile) {
        const formData = new FormData()
        formData.append('file', avatarFile)

        const res = await (toast as any).promise(
          fetch('/api/upload', {
            method: 'POST',
            body: formData,
          }),
          {
            loading: 'Uploading avatar…',
            success: 'Avatar uploaded',
            error: 'Upload failed',
          }
        )
        const data = await res.json()
        finalAvatarUrl = data.url as string
      }

      const toastId = (toast as any).loading('Registering profile…')
      try {
        await register(username, finalAvatarUrl, bio)
        // invalidate cached profile queries so UI updates immediately
        queryClient.invalidateQueries()
        ;(toast as any).success('Profile registered!', { id: toastId })

        // refresh data
        await refetchProfile?.()

        // clear inputs
        setUsername('')
        setAvatarFile(null)
        setBio('')
      } catch (err) {
        console.error(err)
        ;(toast as any).error('Failed to register profile.', { id: toastId })
        throw err
      } finally {
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 mt-6 w-full max-w-md"
    >
      <input
        className="p-2 text-black rounded w-full"
        placeholder="Your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoFocus
      />

      <input
        type="file"
        accept="image/*"
        className="p-2 text-black rounded w-full"
        onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
      />

      <textarea
        className="p-2 text-black rounded w-full"
        placeholder="Tell us about yourself"
        rows={3}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 rounded text-white font-bold"
      >
        {isSubmitting ? 'Registering…' : 'Register Profile'}
      </button>
    </form>
  )
} 