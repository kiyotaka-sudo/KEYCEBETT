import React from 'react'
import { motion } from 'framer-motion'
import { useLiveEvents } from '@/hooks/useEvents'
import { EventCard } from '@/components/sport/EventCard'
import { EventCardSkeleton } from '@/components/sport/EventCardSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'

export const LivePage: React.FC = () => {
  const { data: liveEvents, isLoading } = useLiveEvents()

  /**
   * TODO - AMI 2 : Intégrer l'API de résultats sportifs ici
   * Les événements affichés viendront de /api/events/live
   */

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="mb-6 flex items-center space-x-3">
        <h1 className="text-2xl font-title font-bold">En Direct</h1>
        <span className="bg-danger text-white px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider animate-pulse">
          Live
        </span>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <>
            <EventCardSkeleton />
            <EventCardSkeleton />
          </>
        ) : !liveEvents || liveEvents.length === 0 ? (
          <EmptyState 
            title="Aucun match en direct" 
            description="Il n'y a pas d'événements sportifs en cours pour le moment."
            icon="⏱️"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveEvents.map(event => (
              <EventCard key={event.id} event={event as any} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
