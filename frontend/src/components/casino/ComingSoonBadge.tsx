import React from 'react'

export const ComingSoonBadge: React.FC = () => {
  return (
    <div className="absolute top-2 right-2 bg-primary text-secondary text-[10px] font-bold uppercase px-2 py-1 rounded-md shadow-glow z-10 overflow-hidden group">
      <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-shimmer" />
      Bientôt
    </div>
  )
}
