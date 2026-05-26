import React from 'react'
import { formatXAF, MIN_BET, MAX_BET } from '@/config/constants'
import { BetType } from '@/types/bet.types'
import { motion } from 'framer-motion'

interface BetSlipSummaryProps {
  stake: number
  setStake: (amount: number) => void
  totalOdds: number
  potentialWin: number
  betType: BetType
  onPlaceBet: () => void
  isLoading: boolean
}

export const BetSlipSummary: React.FC<BetSlipSummaryProps> = ({
  stake, setStake, totalOdds, potentialWin, betType, onPlaceBet, isLoading
}) => {
  
  const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value)
    if (isNaN(val)) setStake(0)
    else setStake(val)
  }

  const isStakeValid = stake >= MIN_BET && stake <= MAX_BET

  return (
    <div className="p-4 bg-surface-2/30 border-t border-surface-2">
      <div className="flex justify-between items-center mb-3 text-sm">
        <span className="text-text-muted">Cotes Totales ({betType})</span>
        <span className="font-mono font-bold text-lg">{totalOdds.toFixed(2)}</span>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center border border-surface-2 rounded-lg bg-surface focus-within:border-primary overflow-hidden transition-colors">
          <input 
            type="number" 
            value={stake || ''} 
            onChange={handleStakeChange}
            className="w-full bg-transparent px-3 py-2 text-right font-mono font-bold outline-none"
            placeholder="Montant de la mise"
            min={MIN_BET}
            max={MAX_BET}
          />
          <div className="px-3 text-text-muted text-sm font-medium">XAF</div>
        </div>
        {!isStakeValid && stake > 0 && (
          <p className="text-xs text-danger mt-1">Min: {MIN_BET} XAF, Max: {MAX_BET} XAF</p>
        )}
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium">Gain Potentiel</span>
        <motion.span 
          key={potentialWin}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono font-bold text-xl text-accent"
        >
          {formatXAF(potentialWin)}
        </motion.span>
      </div>

      <button
        disabled={isLoading || !isStakeValid}
        onClick={onPlaceBet}
        className="w-full btn-primary disabled:opacity-50 flex justify-center items-center h-12"
      >
        {isLoading ? (
           <span className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin"></span>
        ) : (
          "VALIDER MON PARI"
        )}
      </button>
    </div>
  )
}
