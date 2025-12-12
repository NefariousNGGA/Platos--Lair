'use client'

import { useState } from 'react'
import { Heart, ThumbsUp, Clap, Bookmark } from 'lucide-react'

interface ReactionButtonsProps {
  postId: string
}

export default function ReactionButtons({ postId }: ReactionButtonsProps) {
  const [reactions, setReactions] = useState({
    like: 0,
    love: 0,
    clap: 0,
    save: 0
  })
  const [userReactions, setUserReactions] = useState<string[]>([])

  const reactionTypes = [
    { type: 'like', icon: ThumbsUp, label: 'Like', color: 'text-blue-500' },
    { type: 'love', icon: Heart, label: 'Love', color: 'text-red-500' },
    { type: 'clap', icon: Clap, label: 'Clap', color: 'text-yellow-500' },
    { type: 'save', icon: Bookmark, label: 'Save', color: 'text-green-500' },
  ]

  const handleReaction = async (type: string) => {
    if (userReactions.includes(type)) return

    try {
      const response = await fetch(`/api/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, type })
      })

      if (response.ok) {
        setReactions(prev => ({
          ...prev,
          [type]: prev[type as keyof typeof prev] + 1
        }))
        setUserReactions(prev => [...prev, type])
      }
    } catch (error) {
      console.error('Error adding reaction:', error)
    }
  }

  return (
    <div className="flex flex-wrap gap-4">
      {reactionTypes.map(({ type, icon: Icon, label, color }) => (
        <button
          key={type}
          onClick={() => handleReaction(type)}
          disabled={userReactions.includes(type)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
            userReactions.includes(type)
              ? `${color} border-current`
              : 'hover:bg-accent'
          }`}
        >
          <Icon size={18} />
          <span className="font-medium">{label}</span>
          <span className="text-sm opacity-75">
            {reactions[type as keyof typeof reactions]}
          </span>
        </button>
      ))}
    </div>
  )
}