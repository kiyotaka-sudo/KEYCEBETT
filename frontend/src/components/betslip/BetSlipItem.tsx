import React from 'react'

interface BetSlipItemProps {
  oddId: number
  homeTeam: string
  awayTeam: string
  marketType: string
  selection: string
  oddValue: number
  onRemove: (oddId: number) => void
}

export const BetSlipItem: React.FC<BetSlipItemProps> = ({
  oddId, homeTeam, awayTeam, marketType, selection, oddValue, onRemove
}) => {
  return (
    <div className="p-3 border-b border-surface-2 bg-surface/50 relative group">
      <button 
        onClick={() => onRemove(oddId)}
        className="absolute top-3 right-3 text-text-muted hover:text-danger"
      >
        ✕
      </button>
      <div className="text-xs text-text-muted mb-1">{homeTeam} vs {awayTeam}</div>
      <div className="flex justify-between items-center mt-2">
        <div>
          <span className="font-semibold text-sm text-primary">{selection}</span>
          <span className="text-xs text-text-muted ml-2">({marketType})</span>
        </div>
        <div className="font-mono font-bold">{oddValue.toFixed(2)}</div>
      </div>
    </div>
  )
}
