export interface Sport {
  id: number
  name: string
  icon: string
  isActive: boolean
  displayOrder: number
}

export interface League {
  id: number
  name: string
  country: string
  logoUrl?: string
  sport: Sport
}

export type EventStatus = 'UPCOMING' | 'LIVE' | 'FINISHED' | 'CANCELLED'

export interface Event {
  id: number
  league: League
  homeTeam: string
  awayTeam: string
  startTime: string
  status: EventStatus
  homeScore?: number
  awayScore?: number
  externalId?: string
}

export interface Odd {
  id: number
  eventId: number
  marketType: string   // 1X2, OVER_UNDER, BTTS, HANDICAP
  selection: string    // HOME, DRAW, AWAY, OVER, UNDER, YES, NO
  value: number
  isActive: boolean
  updatedAt: string
}

export interface EventWithOdds extends Event {
  odds: Odd[]
}
