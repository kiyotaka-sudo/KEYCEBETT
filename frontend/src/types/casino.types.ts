export type GameType = 'CRASH' | 'SLOTS' | 'TABLE' | 'LIVE'

export interface CasinoGame {
  id: number
  name: string
  provider: string
  type: GameType
  thumbnail: string
  isAvailable: boolean
  comingSoon: boolean
  displayOrder: number
}
