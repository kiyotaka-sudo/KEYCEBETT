import api from '@/config/axios'
import { Bet, BetRequest, ApiResponse, PageResponse } from '@/types/bet.types'

export const betService = {
  placeBet: async (request: BetRequest) => {
    const { data } = await api.post<ApiResponse<Bet>>('/bets', request)
    return data.data
  },

  getMyBets: async (page = 0, size = 10) => {
    const { data } = await api.get<ApiResponse<PageResponse<Bet>>>('/bets/my', {
      params: { page, size }
    })
    return data.data
  },

  getBetById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Bet>>(`/bets/${id}`)
    return data.data
  },

  cashOut: async (id: string) => {
    const { data } = await api.post<ApiResponse<Bet>>(`/bets/${id}/cashout`)
    return data.data
  }
}
