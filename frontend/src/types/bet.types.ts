export type BetStatus = 'PENDING' | 'WON' | 'LOST' | 'CANCELLED' | 'CASHED_OUT'
export type BetType   = 'SIMPLE' | 'COMBINED'

export interface BetSelection {
  id: number
  oddId: number
  marketType: string
  selection: string
  oddValueAtBetTime: number
  status: BetStatus
  homeTeam: string
  awayTeam: string
  eventName: string
}

export interface Bet {
  id: string
  userId: string
  betType: BetType
  totalStake: number
  totalOdds: number
  potentialWin: number
  status: BetStatus
  placedAt: string
  settledAt?: string
  selections: BetSelection[]
}

export interface BetRequest {
  stake: number
  oddIds: number[]
}

// BetSlip local (state dans le store, pas depuis l'API)
export interface BetSlipSelection {
  oddId: number
  eventId: number
  homeTeam: string
  awayTeam: string
  marketType: string
  selection: string
  oddValue: number
}
