import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboard.service'

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardService.getStats,
  })
}

export const useRevenue = (period: string = 'month') => {
  return useQuery({
    queryKey: ['dashboard', 'revenue', period],
    queryFn: () => dashboardService.getRevenue(period),
  })
}
