import api from '@/config/axios'
import { Event, EventWithOdds, ApiResponse } from '@/types/sport.types'

export const eventsService = {
  getEvents: async (params?: { leagueId?: number; status?: string; date?: string }) => {
    const { data } = await api.get<ApiResponse<Event[]>>('/events', { params })
    return data.data
  },

  getEventDetails: async (id: number) => {
    const { data } = await api.get<ApiResponse<EventWithOdds>>(`/events/${id}`)
    return data.data
  },

  getLiveEvents: async () => {
    const { data } = await api.get<ApiResponse<Event[]>>('/events/live')
    return data.data
  },

  getResults: async (params?: { date?: string }) => {
    const { data } = await api.get<ApiResponse<Event[]>>('/events/results', { params })
    return data.data
  }
}
