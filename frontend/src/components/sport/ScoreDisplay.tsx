import React from 'react'
import { motion } from 'framer-motion'

interface ScoreDisplayProps {
  homeScore: number
  awayScore: number
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ homeScore, awayScore }) => {
  return (
    <div className="flex items-center space-x-2 font-mono font-bold text-xl text-primary">
      <motion.span 
        key={homeScore}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-2 px-2 py-1 rounded"
      >
        {homeScore}
      </motion.span>
      <span className="text-text-muted text-sm">-</span>
      <motion.span 
        key={awayScore}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-2 px-2 py-1 rounded"
      >
        {awayScore}
      </motion.span>
    </div>
  )
}
