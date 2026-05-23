import React from 'react'
import { motion } from 'framer-motion'
import { useDashboardStats, useRevenue } from '@/hooks/useDashboard'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { formatXAF } from '@/config/constants'
import { Activity, Users, Ticket, Coins } from 'lucide-react'

export const DashboardOverviewPage: React.FC = () => {
  const { data: stats, isLoading: isStatsLoading } = useDashboardStats()
  const { data: revenueData, isLoading: isRevLoading } = useRevenue('month')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-title font-bold">Aperçu Dashboard</h1>
          <p className="text-sm text-text-muted">Statistiques globales KeyceBet</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Revenus (GGR)" 
          value={stats ? formatXAF(stats.grossGamingRevenue) : '...'} 
          icon={<Coins size={24} />} 
          trend={12.5}
          trendLabel="vs mois dernier"
        />
        <StatsCard 
          title="Paris Placés" 
          value={stats?.totalBets || '...'} 
          icon={<Ticket size={24} />} 
          trend={5.2}
        />
        <StatsCard 
          title="Utilisateurs Actifs" 
          value={stats?.activeUsers || '...'} 
          icon={<Users size={24} />} 
          trend={-2.1}
        />
        <StatsCard 
          title="Taux de marge" 
          value={stats && stats.totalBetStakes > 0 ? `${((stats.grossGamingRevenue / stats.totalBetStakes) * 100).toFixed(1)}%` : '...'} 
          icon={<Activity size={24} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 kb-card p-6">
          <h2 className="text-lg font-title font-bold mb-6">Évolution des Revenus</h2>
          {isRevLoading ? (
            <div className="h-80 skeleton rounded-xl" />
          ) : (
            // Mock chart data for demonstration since the API doesn't return time-series by default in this stub
            <RevenueChart data={[
              { date: '01/05', revenue: 120000, bets: 450 },
              { date: '05/05', revenue: 180000, bets: 520 },
              { date: '10/05', revenue: 150000, bets: 480 },
              { date: '15/05', revenue: 210000, bets: 600 },
              { date: '20/05', revenue: 250000, bets: 650 },
              { date: '25/05', revenue: 310000, bets: 720 },
            ]} />
          )}
        </div>
        
        <div className="kb-card p-6">
          <h2 className="text-lg font-title font-bold mb-6">Répartition</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm border-b border-surface-2 pb-2">
              <span className="text-text-muted">Total Dépôts</span>
              <span className="font-mono text-green-400">{stats ? formatXAF(stats.totalDeposits) : '...'}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-surface-2 pb-2">
              <span className="text-text-muted">Total Retraits</span>
              <span className="font-mono text-danger">{stats ? formatXAF(stats.totalWithdrawals) : '...'}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-surface-2 pb-2">
              <span className="text-text-muted">Total Mises</span>
              <span className="font-mono text-white">{stats ? formatXAF(stats.totalBetStakes) : '...'}</span>
            </div>
            <div className="flex justify-between items-center text-sm pb-2">
              <span className="text-text-muted">Total Gains Payés</span>
              <span className="font-mono text-primary">{stats ? formatXAF(stats.totalWinsPaid) : '...'}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
