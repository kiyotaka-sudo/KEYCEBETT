import React from 'react'
import { CasinoGame } from '@/types/casino.types'
import { ComingSoonBadge } from './ComingSoonBadge'

interface CasinoGameCardProps {
  game: CasinoGame
  onClick: (game: CasinoGame) => void
}

export const CasinoGameCard: React.FC<CasinoGameCardProps> = ({ game, onClick }) => {
  return (
    <div 
      onClick={() => onClick(game)}
      className="group relative rounded-xl overflow-hidden cursor-pointer border border-surface-2 bg-surface hover:border-primary/50 transition-colors aspect-[3/4]"
    >
      {game.comingSoon && <ComingSoonBadge />}
      
      {/* Thumbnail placeholder - Dans un vrai projet, utiliser la vraie image (game.thumbnail) */}
      <div className="absolute inset-0 bg-surface-2 flex items-center justify-center p-4">
         <span className="text-4xl opacity-50 group-hover:scale-110 transition-transform">
           {game.type === 'CRASH' ? '✈️' : game.type === 'TABLE' ? '🃏' : '🎰'}
         </span>
      </div>

      {/* Overlay dégradé */}
      <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent opacity-90" />
      
      {/* Infos jeu */}
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform">
        <h3 className="font-title font-semibold text-sm truncate">{game.name}</h3>
        <p className="text-[10px] text-text-muted uppercase tracking-wider">{game.provider}</p>
      </div>
    </div>
  )
}
