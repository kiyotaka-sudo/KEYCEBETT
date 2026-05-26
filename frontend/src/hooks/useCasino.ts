import { useQuery } from '@tanstack/react-query'
import { casinoService } from '@/services/casino.service'

export const useCasinoGames = () => {
  return useQuery({
    queryKey: ['casino', 'games'],
    queryFn: casinoService.getGames,
  })
}
