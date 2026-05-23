import React from 'react'
import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { useEventDetails } from '@/hooks/useEvents'
import { OddButton } from '@/components/sport/OddButton'
import { Spinner } from '@/components/ui/Spinner'
import { ChevronLeft } from 'lucide-react'
import { format } from 'date-fns'

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data: event, isLoading } = useEventDetails(Number(id))

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  if (!event) {
    return <div className="text-center py-20">Événement introuvable</div>
  }

  // Grouper les cotes par type de marché (ex: 1X2, OVER_UNDER)
  const groupedOdds = event.odds.reduce((acc, odd) => {
    if (!acc[odd.marketType]) acc[odd.marketType] = []
    acc[odd.marketType].push(odd)
    return acc
  }, {} as Record<string, typeof event.odds>)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-3xl mx-auto"
    >
      <Link to="/" className="inline-flex items-center text-text-muted hover:text-white transition-colors mb-2 text-sm">
        <ChevronLeft size={16} className="mr-1" /> Retour
      </Link>

      {/* Header Match */}
      <div className="kb-card bg-surface-2 p-6 text-center border-t-4 border-t-primary">
        <p className="text-sm text-text-muted mb-4 uppercase tracking-wider">{event.league.name}</p>
        <div className="flex justify-between items-center px-4 md:px-12">
          <div className="flex-1 text-right">
            <h2 className="text-xl md:text-2xl font-bold font-title">{event.homeTeam}</h2>
          </div>
          <div className="px-6 flex flex-col items-center">
             {event.status === 'LIVE' ? (
               <div className="text-3xl font-mono font-bold text-primary mb-2">
                 {event.homeScore} - {event.awayScore}
               </div>
             ) : (
               <div className="text-2xl font-bold text-text-muted mb-2">VS</div>
             )}
             <span className="text-xs text-text-muted font-medium bg-surface px-3 py-1 rounded-full border border-surface-2">
               {event.status === 'LIVE' ? <span className="text-danger animate-pulse">EN DIRECT</span> : format(new Date(event.startTime), 'dd/MM HH:mm')}
             </span>
          </div>
          <div className="flex-1 text-left">
            <h2 className="text-xl md:text-2xl font-bold font-title">{event.awayTeam}</h2>
          </div>
        </div>
      </div>

      {/* Marchés (Odds) */}
      <div className="space-y-4">
        {Object.entries(groupedOdds).map(([marketType, odds]) => (
          <div key={marketType} className="kb-card overflow-hidden">
            <div className="bg-surface-2/50 px-4 py-3 border-b border-surface-2">
              <h3 className="font-title font-semibold text-sm">{marketType === '1X2' ? 'Résultat du match (1X2)' : marketType}</h3>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {odds.map(odd => (
                <OddButton
                  key={odd.id}
                  oddId={odd.id}
                  eventId={event.id}
                  homeTeam={event.homeTeam}
                  awayTeam={event.awayTeam}
                  marketType={odd.marketType}
                  selection={odd.selection}
                  oddValue={odd.value}
                  disabled={!odd.isActive}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
