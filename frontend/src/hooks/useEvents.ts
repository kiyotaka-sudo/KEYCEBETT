import { useQuery } from '@tanstack/react-query'
import { eventsService } from '@/services/events.service'

export const useEvents = (params?: { leagueId?: number; status?: string; date?: string }) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => eventsService.getEvents(params),
  })
}

export const useEventDetails = (id: number) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsService.getEventDetails(id),
    enabled: !!id,
  })
}

export const useLiveEvents = () => {
  return useQuery({
    queryKey: ['events', 'live'],
    queryFn: eventsService.getLiveEvents,
    refetchInterval: 30000, // Rafraîchir toutes les 30s
  })
}

export const useResults = (params?: { date?: string }) => {
  return useQuery({
    queryKey: ['events', 'results', params],
    queryFn: () => eventsService.getResults(params),
  })
}
