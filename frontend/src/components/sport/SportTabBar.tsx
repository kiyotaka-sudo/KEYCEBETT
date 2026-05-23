import React from 'react'
import { motion } from 'framer-motion'
import { Sport } from '@/types/sport.types'

interface SportTabBarProps {
  sports: Sport[]
  activeSportId: number | null
  onSelect: (id: number | null) => void
}

export const SportTabBar: React.FC<SportTabBarProps> = ({ sports, activeSportId, onSelect }) => {
  return (
    <div className="flex overflow-x-auto scrollbar-hide py-2 px-1 mb-4 space-x-2">
      <button
        onClick={() => onSelect(null)}
        className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-colors border ${
          activeSportId === null 
            ? 'bg-primary border-primary text-secondary' 
            : 'bg-surface border-surface-2 text-text-muted hover:text-white'
        }`}
      >
        🌟 Tous
      </button>
      
      {sports.map(sport => (
        <button
          key={sport.id}
          onClick={() => onSelect(sport.id)}
          className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-colors border flex items-center space-x-2 ${
            activeSportId === sport.id 
              ? 'bg-primary border-primary text-secondary' 
              : 'bg-surface border-surface-2 text-text-muted hover:text-white'
          }`}
        >
          <span>{sport.icon}</span>
          <span>{sport.name}</span>
        </button>
      ))}
    </div>
  )
}
