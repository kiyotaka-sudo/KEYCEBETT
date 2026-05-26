import api from '@/config/axios'
import { Odd, ApiResponse } from '@/types/sport.types'

export const oddsService = {
  getEventOdds: async (eventId: number) => {
    const { data } = await api.get<ApiResponse<Odd[]>>(`/events/${eventId}/odds`)
    return data.data
  }
}
