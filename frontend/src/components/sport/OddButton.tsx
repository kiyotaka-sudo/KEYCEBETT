import React from 'react'
import { motion } from 'framer-motion'
import { useBetSlipStore } from '@/store/betSlipStore'

interface OddButtonProps {
  oddId: number
  eventId: number
  homeTeam: string
  awayTeam: string
  marketType: string
  selection: string
  oddValue: number
  disabled?: boolean
}

export const OddButton: React.FC<OddButtonProps> = ({ 
  oddId, eventId, homeTeam, awayTeam, marketType, selection, oddValue, disabled 
}) => {
  const { selections, toggleSelection } = useBetSlipStore()
  
  const isSelected = selections.some(s => s.oddId === oddId)

  const handleToggle = () => {
    if (disabled) return
    toggleSelection({
      oddId,
      eventId,
      homeTeam,
      awayTeam,
      marketType,
      selection,
      oddValue
    })
  }

  // Helper pour afficher le label ("1", "X", "2" etc.)
  const getLabel = () => {
    if (selection === 'HOME') return '1'
    if (selection === 'DRAW') return 'X'
    if (selection === 'AWAY') return '2'
    return selection
  }

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.92 }}
      onClick={handleToggle}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center p-2 rounded-lg border transition-all
        ${disabled ? 'opacity-50 cursor-not-allowed border-surface-2 bg-surface-2/50' : 
          isSelected 
            ? 'odd-selected' 
            : 'border-surface-2 bg-surface hover:border-primary/50 hover:bg-surface-2'
        }
      `}
    >
      <span className="text-xs font-medium mb-1 opacity-70">{getLabel()}</span>
      <span className="font-mono font-bold text-sm">{oddValue.toFixed(2)}</span>
    </motion.button>
  )
}
