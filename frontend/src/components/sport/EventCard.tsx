import React from 'react'
import { EventWithOdds } from '@/types/sport.types'
import { OddButton } from './OddButton'
import { LiveBadge } from './LiveBadge'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

interface EventCardProps {
  event: EventWithOdds
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const isLive = event.status === 'LIVE'
  
  // Extraire les cotes 1X2 (Match Result)
  const odds1x2 = event.odds.filter(o => o.marketType === '1X2')
  const homeOdd = odds1x2.find(o => o.selection === 'HOME')
  const drawOdd = odds1x2.find(o => o.selection === 'DRAW')
  const awayOdd = odds1x2.find(o => o.selection === 'AWAY')

  return (
    <div className={`kb-card p-4 relative overflow-hidden ${isLive ? 'live-border' : ''}`}>
      
      {/* Header : League & Time */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2 text-xs text-text-muted">
          <span>🏆 {event.league.name}</span>
        </div>
        <div className="flex items-center space-x-2 text-xs font-medium">
          {isLive ? <LiveBadge /> : <span>🕒 {format(new Date(event.startTime), 'HH:mm')}</span>}
        </div>
      </div>

      {/* Teams & Score */}
      <Link to={`/event/${event.id}`} className="block mb-4 hover:opacity-80 transition-opacity">
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-1.5 font-semibold text-sm sm:text-base">
            <span>{event.homeTeam}</span>
            <span>{event.awayTeam}</span>
          </div>
          {isLive && (
            <div className="flex flex-col items-end space-y-1 font-mono text-lg text-primary font-bold">
              <span>{event.homeScore ?? 0}</span>
              <span>{event.awayScore ?? 0}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Odds 1X2 Grid */}
      <div className="grid grid-cols-3 gap-2">
        {homeOdd ? (
          <OddButton 
            oddId={homeOdd.id} eventId={event.id} homeTeam={event.homeTeam} awayTeam={event.awayTeam}
            marketType="1X2" selection="HOME" oddValue={homeOdd.value} disabled={!homeOdd.isActive}
          />
        ) : <div className="bg-surface-2/50 rounded-lg" />}
        
        {drawOdd ? (
          <OddButton 
            oddId={drawOdd.id} eventId={event.id} homeTeam={event.homeTeam} awayTeam={event.awayTeam}
            marketType="1X2" selection="DRAW" oddValue={drawOdd.value} disabled={!drawOdd.isActive}
          />
        ) : <div className="bg-surface-2/50 rounded-lg" />}
        
        {awayOdd ? (
          <OddButton 
            oddId={awayOdd.id} eventId={event.id} homeTeam={event.homeTeam} awayTeam={event.awayTeam}
            marketType="1X2" selection="AWAY" oddValue={awayOdd.value} disabled={!awayOdd.isActive}
          />
        ) : <div className="bg-surface-2/50 rounded-lg" />}
      </div>

      <div className="mt-3 text-center">
        <Link to={`/event/${event.id}`} className="text-xs text-primary hover:underline">
          + de marchés
        </Link>
      </div>
    </div>
  )
}
