import api from '@/config/axios'
import { CasinoGame, ApiResponse } from '@/types/casino.types'

export const casinoService = {
  getGames: async () => {
    const { data } = await api.get<ApiResponse<CasinoGame[]>>('/casino/games')
    return data.data
  },

  getGameById: async (id: number) => {
    const { data } = await api.get<ApiResponse<CasinoGame>>(`/casino/games/${id}`)
    return data.data
  }
}
