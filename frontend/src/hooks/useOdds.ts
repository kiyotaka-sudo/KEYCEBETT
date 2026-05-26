import { useQuery } from '@tanstack/react-query'
import { oddsService } from '@/services/odds.service'

export const useEventOdds = (eventId: number) => {
  return useQuery({
    queryKey: ['odds', eventId],
    queryFn: () => oddsService.getEventOdds(eventId),
    enabled: !!eventId,
    refetchInterval: 15000, // Rafraîchir les cotes toutes les 15s
  })
}
