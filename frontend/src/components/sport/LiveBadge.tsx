import React from 'react'

export const LiveBadge: React.FC = () => {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-danger/20 text-danger border border-danger/30 uppercase animate-live-pulse">
      <span className="w-1.5 h-1.5 rounded-full bg-danger mr-1 animate-pulse-dot" />
      Live
    </span>
  )
}
