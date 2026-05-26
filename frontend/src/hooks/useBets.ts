import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { betService } from '@/services/bet.service'
import { BetRequest } from '@/types/bet.types'
import { useBetSlipStore } from '@/store/betSlipStore'
import { useWallet } from './useWallet'
import toast from 'react-hot-toast'

export const usePlaceBet = () => {
  const queryClient = useQueryClient()
  const clearSlip = useBetSlipStore((state) => state.clearSlip)
  const { refetch: refetchWallet } = useWallet()

  return useMutation({
    mutationFn: (request: BetRequest) => betService.placeBet(request),
    onSuccess: () => {
      toast.success('Pari placé avec succès !')
      clearSlip()
      refetchWallet()
      queryClient.invalidateQueries({ queryKey: ['bets'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors du placement du pari')
    },
  })
}

export const useMyBets = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['bets', 'my', page, size],
    queryFn: () => betService.getMyBets(page, size),
  })
}

export const useBetDetails = (id: string) => {
  return useQuery({
    queryKey: ['bet', id],
    queryFn: () => betService.getBetById(id),
    enabled: !!id,
  })
}
