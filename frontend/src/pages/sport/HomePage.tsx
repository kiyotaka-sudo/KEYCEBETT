import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useSports } from '@/hooks/useSports'
import { useEvents } from '@/hooks/useEvents'
import { SportTabBar } from '@/components/sport/SportTabBar'
import { EventFilters } from '@/components/sport/EventFilters'
import { EventCard } from '@/components/sport/EventCard'
import { EventCardSkeleton } from '@/components/sport/EventCardSkeleton'
import { LeagueHeader } from '@/components/sport/LeagueHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { useTranslation } from 'react-i18next'

export const HomePage: React.FC = () => {
  const { t } = useTranslation()
  const [activeSportId, setActiveSportId] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const { data: sports, isLoading: isSportsLoading } = useSports()
  const { data: events, isLoading: isEventsLoading } = useEvents({ 
    // Si API permet: sportId: activeSportId, filter: activeFilter
  })

  // Dans la vraie vie, l'API devrait filtrer. Ici on simule si l'API renvoie tout
  const filteredEvents = React.useMemo(() => {
    if (!events) return []
    let result = events
    if (activeSportId) {
      result = result.filter(e => e.league.sport.id === activeSportId)
    }
    // group by league
    return result
  }, [events, activeSportId])

  // Group events by league
  const groupedEvents = React.useMemo(() => {
    const groups: Record<number, typeof filteredEvents> = {}
    filteredEvents.forEach(e => {
      if (!groups[e.league.id]) groups[e.league.id] = []
      groups[e.league.id].push(e)
    })
    return groups
  }, [filteredEvents])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-title font-bold mb-4 text-text-primary">{t('home.title')}</h1>
        {!isSportsLoading && sports && (
          <SportTabBar 
            sports={sports} 
            activeSportId={activeSportId} 
            onSelect={setActiveSportId} 
          />
        )}
        <EventFilters 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />
      </div>

      <div className="space-y-6">
        {isEventsLoading ? (
          <>
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </>
        ) : filteredEvents.length === 0 ? (
          <EmptyState 
            title={t('home.noMatch')} 
            description={t('home.noMatchDesc')}
            icon="⚽"
          />
        ) : (
          Object.values(groupedEvents).map(leagueEvents => (
            <div key={leagueEvents[0].league.id}>
              <LeagueHeader 
                name={leagueEvents[0].league.name} 
                country={leagueEvents[0].league.country} 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leagueEvents.map(event => (
                  // Force un cast ici car mockData renvoie EventWithOdds
                  <EventCard key={event.id} event={event as any} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  )
}
