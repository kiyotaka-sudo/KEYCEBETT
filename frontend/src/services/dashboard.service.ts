import api from '@/config/axios'
import { DashboardStats, RevenueData, ApiResponse } from '@/types/dashboard.types'

export const dashboardService = {
  getStats: async () => {
    const { data } = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats')
    return data.data
  },

  getRevenue: async (period: string = 'month') => {
    const { data } = await api.get<ApiResponse<RevenueData>>('/dashboard/revenue', { params: { period } })
    return data.data
  }
}
