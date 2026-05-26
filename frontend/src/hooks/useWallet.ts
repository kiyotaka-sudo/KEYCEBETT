import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { walletService } from '@/services/wallet.service'
import { DepositRequest, WithdrawRequest } from '@/types/wallet.types'
import toast from 'react-hot-toast'

export const useWallet = () => {
  return useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: walletService.getBalance,
  })
}

export const useTransactions = (page = 0, size = 20) => {
  return useQuery({
    queryKey: ['wallet', 'transactions', page, size],
    queryFn: () => walletService.getTransactions(page, size),
  })
}

/** Invalide le cache wallet pour forcer un refetch du solde */
export const useInvalidateWallet = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['wallet'] })
}

export const useDeposit = () => {
  // NE PAS invalider ici — on attend la confirmation webhook via polling
  return useMutation({
    mutationFn: (request: DepositRequest) => walletService.deposit(request),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors du depot')
    },
  })
}

export const useWithdraw = () => {
  // NE PAS invalider ici — on attend la confirmation webhook via polling
  return useMutation({
    mutationFn: (request: WithdrawRequest) => walletService.withdraw(request),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors du retrait')
    },
  })
}
