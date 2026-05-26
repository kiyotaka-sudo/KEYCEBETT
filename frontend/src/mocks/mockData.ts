import { EventWithOdds, Sport, League } from '@/types/sport.types'
import { CasinoGame } from '@/types/casino.types'
import { Bet } from '@/types/bet.types'
import { Transaction, Wallet } from '@/types/wallet.types'

// SPORTS
export const MOCK_SPORTS: Sport[] = [
  { id: 1, name: 'Football', icon: '⚽', isActive: true, displayOrder: 1 },
  { id: 2, name: 'Basketball', icon: '🏀', isActive: true, displayOrder: 2 },
  { id: 3, name: 'Tennis', icon: '🎾', isActive: true, displayOrder: 3 },
  { id: 4, name: 'Rugby', icon: '🏉', isActive: true, displayOrder: 4 },
  { id: 5, name: 'Volleyball', icon: '🏐', isActive: true, displayOrder: 5 },
]

// LEAGUES
export const MOCK_LEAGUES: League[] = [
  { id: 1, name: 'Ligue 1', country: 'France', sport: MOCK_SPORTS[0] },
  { id: 2, name: 'Premier League', country: 'Angleterre', sport: MOCK_SPORTS[0] },
  { id: 3, name: 'NBA', country: 'USA', sport: MOCK_SPORTS[1] },
]

// EVENTS (UPCOMING)
export const MOCK_EVENTS: EventWithOdds[] = [
  {
    id: 101,
    league: MOCK_LEAGUES[0],
    homeTeam: 'PSG',
    awayTeam: 'Marseille',
    startTime: new Date(Date.now() + 86400000).toISOString(),
    status: 'UPCOMING',
    odds: [
      { id: 1, eventId: 101, marketType: '1X2', selection: 'HOME', value: 1.85, isActive: true, updatedAt: new Date().toISOString() },
      { id: 2, eventId: 101, marketType: '1X2', selection: 'DRAW', value: 3.40, isActive: true, updatedAt: new Date().toISOString() },
      { id: 3, eventId: 101, marketType: '1X2', selection: 'AWAY', value: 4.20, isActive: true, updatedAt: new Date().toISOString() },
    ]
  },
  {
    id: 102,
    league: MOCK_LEAGUES[1],
    homeTeam: 'Arsenal',
    awayTeam: 'Man City',
    startTime: new Date(Date.now() + 172800000).toISOString(),
    status: 'UPCOMING',
    odds: [
      { id: 4, eventId: 102, marketType: '1X2', selection: 'HOME', value: 2.80, isActive: true, updatedAt: new Date().toISOString() },
      { id: 5, eventId: 102, marketType: '1X2', selection: 'DRAW', value: 3.10, isActive: true, updatedAt: new Date().toISOString() },
      { id: 6, eventId: 102, marketType: '1X2', selection: 'AWAY', value: 2.50, isActive: true, updatedAt: new Date().toISOString() },
    ]
  }
]

// LIVE EVENTS
export const MOCK_LIVE_EVENTS: EventWithOdds[] = [
  {
    id: 201,
    league: MOCK_LEAGUES[0],
    homeTeam: 'Lyon',
    awayTeam: 'Lille',
    startTime: new Date(Date.now() - 3600000).toISOString(),
    status: 'LIVE',
    homeScore: 1,
    awayScore: 0,
    odds: [
      { id: 7, eventId: 201, marketType: '1X2', selection: 'HOME', value: 1.15, isActive: true, updatedAt: new Date().toISOString() },
      { id: 8, eventId: 201, marketType: '1X2', selection: 'DRAW', value: 4.50, isActive: true, updatedAt: new Date().toISOString() },
      { id: 9, eventId: 201, marketType: '1X2', selection: 'AWAY', value: 12.0, isActive: true, updatedAt: new Date().toISOString() },
    ]
  }
]

// CASINO
export const MOCK_CASINO: CasinoGame[] = [
  { id: 1, name: 'Aviator', provider: 'Spribe', type: 'CRASH', thumbnail: '', isAvailable: false, comingSoon: true, displayOrder: 1 },
  { id: 2, name: 'Mines', provider: 'Spribe', type: 'CRASH', thumbnail: '', isAvailable: false, comingSoon: true, displayOrder: 2 },
  { id: 3, name: 'Dice', provider: 'Spribe', type: 'CRASH', thumbnail: '', isAvailable: false, comingSoon: true, displayOrder: 3 },
  { id: 4, name: 'Blackjack', provider: 'Pragmatic', type: 'TABLE', thumbnail: '', isAvailable: false, comingSoon: true, displayOrder: 4 },
  { id: 5, name: 'Roulette', provider: 'Pragmatic', type: 'TABLE', thumbnail: '', isAvailable: false, comingSoon: true, displayOrder: 5 },
]

// WALLET
export const MOCK_WALLET: Wallet = { userId: '1', balance: 12500, currency: 'XAF' }
export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'DEPOSIT', amount: 5000, status: 'COMPLETED', createdAt: new Date().toISOString() },
  { id: 't2', type: 'BET_STAKE', amount: 1000, status: 'COMPLETED', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 't3', type: 'BET_WIN', amount: 3400, status: 'COMPLETED', createdAt: new Date(Date.now() - 86400000).toISOString() },
]

// BETS
export const MOCK_BETS: Bet[] = [
  {
    id: 'b1',
    userId: '1',
    betType: 'SIMPLE',
    totalStake: 1000,
    totalOdds: 3.40,
    potentialWin: 3400,
    status: 'WON',
    placedAt: new Date(Date.now() - 86400000).toISOString(),
    selections: [
      { id: 1, oddId: 2, marketType: '1X2', selection: 'DRAW', oddValueAtBetTime: 3.40, status: 'WON', homeTeam: 'PSG', awayTeam: 'Marseille', eventName: 'PSG vs Marseille' }
    ]
  }
]
