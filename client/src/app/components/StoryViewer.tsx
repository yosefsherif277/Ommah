'use client'

import { X, BadgeCheck } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Story } from '../assets/assets'

const StoryViewer = ({
  viewStory,
  setViewStory,
}: {
  viewStory: Story | null
  setViewStory: (story: Story | null) => void
}) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let storyCloseTimer: NodeJS.Timeout
    let progressInterval: NodeJS.Timeout

    if (viewStory && viewStory.media_type !== 'video') {
      setProgress(0)

      const STORY_DURATION_MS = 10000
      const UPDATE_INTERVAL_MS = 100
      let timeElapsedMs = 0

      progressInterval = setInterval(() => {
        timeElapsedMs += UPDATE_INTERVAL_MS
        const newProgress = (timeElapsedMs / STORY_DURATION_MS) * 100
        setProgress(newProgress)
      }, UPDATE_INTERVAL_MS)

      storyCloseTimer = setTimeout(() => {
        setViewStory(null)
      }, STORY_DURATION_MS)
    }

    return () => {
      clearTimeout(storyCloseTimer)
      clearInterval(progressInterval)
    }
  }, [viewStory, setViewStory])

  const handleClose = () => setViewStory(null)

  if (!viewStory) return null

  const renderContent = () => {
    switch (viewStory.media_type) {
      case 'image':
        return (
          <Image
            src={viewStory.media_url}
            alt="Story image"
            width={800}
            height={1200}
            className="max-w-full max-h-screen object-contain"
            priority
          />
        )
      case 'video':
        return (
          <video
            onEnded={() => setViewStory(null)}
            src={viewStory.media_url}
            className="max-h-screen w-auto"
            autoPlay
            controls
          />
        )
      case 'text':
        return (
          <div className="w-full h-full flex items-center justify-center p-8 text-white text-2xl text-center">
            {viewStory.content}
          </div>
        )
      default:
        const _exhaustiveCheck: never = viewStory.media_type
        return null
    }
  }

  return (
    <div
      className="fixed inset-0 h-screen bg-black bg-opacity-90 z-[110] flex items-center justify-center"
      style={{
        backgroundColor: viewStory.media_type === 'text' ? viewStory.background_color : '#000000'
      }}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
        <div
          className="h-full bg-white transition-all duration-100 linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* User Info - Top Left */}
      <div className="absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 backdrop-blur-2xl rounded bg-black/50">
        <Image
          src={viewStory.user.profile_picture}
          alt="User profile"
          width={32}
          height={32}
          className="size-7 sm:size-8 rounded-full object-cover border border-white"
          priority
        />
        <div className="text-white font-medium flex items-center gap-1.5">
          <span>{viewStory.user.full_name}</span>
          <BadgeCheck size={18} />
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none"
        aria-label="Close story"
      >
        <X className="w-8 h-8 hover:scale-110 transition cursor-pointer" />
      </button>

      {/* Story Content */}
      {renderContent()}
    </div>
  )
}

export default StoryViewer