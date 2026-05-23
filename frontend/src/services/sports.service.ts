import api from '@/config/axios'
import { Sport, League, ApiResponse } from '@/types/sport.types'

export const sportsService = {
  getSports: async () => {
    const { data } = await api.get<ApiResponse<Sport[]>>('/sports')
    return data.data
  },
  
  getLeagues: async (sportId?: number) => {
    const url = sportId ? `/leagues?sportId=${sportId}` : '/leagues'
    const { data } = await api.get<ApiResponse<League[]>>(url)
    return data.data
  }
}
