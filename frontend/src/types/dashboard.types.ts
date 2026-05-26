export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalBets: number
  pendingBets: number
  wonBets: number
  lostBets: number
  totalDeposits: number
  totalWithdrawals: number
  totalBetStakes: number
  totalWinsPaid: number
  grossGamingRevenue: number
  totalEvents: number
  liveEvents: number
}

export interface RevenueData {
  period: string
  from: string
  to: string
  totalDeposits: number
  totalWithdrawals: number
  totalStakes: number
  totalWins: number
  grossGamingRevenue: number
  netRevenue: number
}

export interface ChartDataPoint {
  date: string
  revenue: number
  bets: number
}
