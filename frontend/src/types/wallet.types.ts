export type TransactionType   = 'DEPOSIT' | 'WITHDRAWAL' | 'BET_STAKE' | 'BET_WIN' | 'REFUND'
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  status: TransactionStatus
  reference?: string
  provider?: string
  createdAt: string
}

export interface Wallet {
  userId: string
  balance: number
  currency: string
}

export interface DepositRequest {
  amount: number
  provider: string
  phoneNumber: string
}

export interface WithdrawRequest {
  amount: number
  provider: string
  phoneNumber: string
}
