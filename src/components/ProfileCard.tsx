'use client'

import { useState } from 'react'
import { useChatCoin } from '@/hooks/useChatCoin'
import { toast } from 'react-hot-toast'

export interface Profile {
  username: string
  avatarUrl: string
  bio: string
}

interface Props {
  profile: Profile
  refetchProfile?: () => void
}

const isValidImageUrl = (url: string) =>
  /^https?:\/\/.+\.(png|jpe?g|gif|svg|webp)$/i.test(url.trim())

export default function ProfileCard({ profile, refetchProfile }: Props) {
  const { updateProfile } = useChatCoin()

  const [editing, setEditing] = useState(false)
  const [newAvatar, setNewAvatar] = useState(profile.avatarUrl)
  const [newBio, setNewBio] = useState(profile.bio)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    try {
      setSaving(true)
      await (toast as any).promise(updateProfile(newAvatar, newBio), {
        loading: 'Updating…',
        success: 'Profile updated',
        error: (e: unknown) => (e as Error).message ?? 'Update failed',
      })
      await refetchProfile?.()
      setEditing(false)
    } catch (_) {
      // no-op (toast already shown)
    } finally {
      setSaving(false)
    }
  }

  if (!profile?.username) {
    return (
      <div className="mt-6 p-4 border rounded bg-gray-800 max-w-md text-gray-300">
        <p>No profile registered yet.</p>
      </div>
    )
  }

  return (
    <div className="mt-6 p-4 border rounded bg-gray-800 max-w-md flex flex-col gap-3">
      <h3 className="text-xl font-semibold">Your Profile</h3>
      {isValidImageUrl(profile.avatarUrl) && !editing && (
        <img
          src={profile.avatarUrl}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover mb-2"
        />
      )}

      <h2 className="text-2xl font-semibold mb-2">{profile.username}</h2>

      {editing ? (
        <>
          <input
            className="p-2 text-black rounded w-full mb-2"
            value={newAvatar}
            onChange={(e) => setNewAvatar(e.target.value)}
            placeholder="Avatar URL"
          />
          <textarea
            className="p-2 text-black rounded w-full mb-2"
            rows={3}
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            placeholder="Bio"
          />
          <button
            className="px-4 py-1 bg-green-600 rounded text-white mr-2 disabled:opacity-60"
            disabled={saving}
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="px-4 py-1 bg-gray-600 rounded text-white"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <p className="whitespace-pre-line mb-3">{profile.bio}</p>
          <button
            className="mt-3 px-4 py-1 bg-blue-600 rounded text-white"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>
        </>
      )}
    </div>
  )
} 