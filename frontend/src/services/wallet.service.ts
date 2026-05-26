import api from '@/config/axios'
import {
  Wallet,
  Transaction,
  DepositRequest,
  WithdrawRequest,
  ApiResponse,
  PageResponse
} from '@/types/wallet.types'

export const walletService = {
  getBalance: async () => {
    const { data } = await api.get<ApiResponse<Wallet>>('/wallet/balance')
    return data.data
  },

  getTransactions: async (page = 0, size = 20) => {
    const { data } = await api.get<ApiResponse<PageResponse<Transaction>>>('/wallet/transactions', {
      params: { page, size }
    })
    return data.data
  },

  deposit: async (request: DepositRequest) => {
    const { data } = await api.post<ApiResponse<Transaction>>('/wallet/deposit', request)
    return data
  },

  withdraw: async (request: WithdrawRequest) => {
    const { data } = await api.post<ApiResponse<Transaction>>('/wallet/withdraw', request)
    return data
  },

  /**
   * Interroge le backend pour connaître le statut actuel d'un paiement.
   * Utilisé en mode polling (toutes les 3s) après l'initiation d'un paiement.
   */
  checkPayment: async (reference: string) => {
    const { data } = await api.get<ApiResponse<Transaction>>(`/wallet/check-payment/${reference}`)
    return data.data
  }
}
