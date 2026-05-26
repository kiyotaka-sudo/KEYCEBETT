import React from 'react'
import { motion } from 'framer-motion'
import { useResults } from '@/hooks/useEvents'
import { ScoreDisplay } from '@/components/sport/ScoreDisplay'
import { EmptyState } from '@/components/ui/EmptyState'
import { format } from 'date-fns'

export const ResultsPage: React.FC = () => {
  const { data: results, isLoading } = useResults()

  /**
   * TODO - AMI 2 : Intégrer l'API de résultats sportifs ici
   * Les résultats affichés viendront de /api/events/results
   */

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-title font-bold">Résultats</h1>
        <p className="text-sm text-text-muted">Consultez les résultats des matchs récents</p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-8"><span className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>
        ) : !results || results.length === 0 ? (
          <EmptyState 
            title="Aucun résultat" 
            description="Les résultats récents s'afficheront ici."
            icon="📊"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map(event => (
              <div key={event.id} className="kb-card p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-text-muted">🏆 {event.league.name}</span>
                  <span className="text-xs font-medium text-text-muted">
                    {format(new Date(event.startTime), 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col space-y-1.5 font-semibold text-sm sm:text-base">
                    <span>{event.homeTeam}</span>
                    <span>{event.awayTeam}</span>
                  </div>
                  <ScoreDisplay homeScore={event.homeScore ?? 0} awayScore={event.awayScore ?? 0} />
                </div>
                <div className="mt-4 pt-3 border-t border-surface-2 flex justify-between items-center text-xs">
                  <span className="text-text-muted uppercase tracking-wider">Terminé</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
