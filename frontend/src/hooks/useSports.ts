import { useQuery } from '@tanstack/react-query'
import { sportsService } from '@/services/sports.service'

export const useSports = () => {
  return useQuery({
    queryKey: ['sports'],
    queryFn: sportsService.getSports,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useLeagues = (sportId?: number) => {
  return useQuery({
    queryKey: ['leagues', sportId],
    queryFn: () => sportsService.getLeagues(sportId),
    staleTime: 5 * 60 * 1000,
  })
}
