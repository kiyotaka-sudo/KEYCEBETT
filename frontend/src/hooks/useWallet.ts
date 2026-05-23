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

export const useDeposit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: DepositRequest) => walletService.deposit(request),
    onSuccess: () => {
      toast.success('Demande de dépôt initiée')
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors du dépôt')
    },
  })
}

export const useWithdraw = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: WithdrawRequest) => walletService.withdraw(request),
    onSuccess: () => {
      toast.success('Demande de retrait initiée')
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors du retrait')
    },
  })
}
