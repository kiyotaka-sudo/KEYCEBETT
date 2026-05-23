import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useCasinoGames } from '@/hooks/useCasino'
import { CasinoBanner } from '@/components/casino/CasinoBanner'
import { CasinoGameCard } from '@/components/casino/CasinoGameCard'
import { CasinoComingSoonModal } from '@/components/casino/CasinoComingSoonModal'
import { EmptyState } from '@/components/ui/EmptyState'
import { CasinoGame } from '@/types/casino.types'

export const CasinoPage: React.FC = () => {
  const { data: games, isLoading } = useCasinoGames()
  const [selectedGame, setSelectedGame] = useState<CasinoGame | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <CasinoBanner />

      <div className="mb-6">
        <h2 className="text-2xl font-title font-bold mb-2">Tous les jeux</h2>
        <p className="text-sm text-text-muted">Préparez-vous à jouer aux meilleurs jeux</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="aspect-[3/4] skeleton rounded-xl" />)}
        </div>
      ) : !games || games.length === 0 ? (
        <EmptyState title="Aucun jeu" description="Revenez plus tard." icon="🎰" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {games.map(game => (
            <CasinoGameCard 
              key={game.id} 
              game={game} 
              onClick={setSelectedGame} 
            />
          ))}
        </div>
      )}

      <CasinoComingSoonModal 
        isOpen={!!selectedGame} 
        onClose={() => setSelectedGame(null)} 
        game={selectedGame} 
      />
    </motion.div>
  )
}
