// Types stricts pour les providers de paiement Mobile Money Cameroun
export type PaymentProvider = 'MTN_MOMO' | 'ORANGE_MONEY'
export type TransactionType   = 'DEPOSIT' | 'WITHDRAWAL' | 'BET_STAKE' | 'BET_WIN' | 'REFUND'
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  status: TransactionStatus
  reference?: string
  provider?: string
  /** ID MonetBil — utilisé pour le polling /check-payment/{reference} */
  paymentId?: string
  createdAt: string
}

export interface Wallet {
  userId: string
  balance: number
  currency: string
}

export interface DepositRequest {
  amount: number
  provider: PaymentProvider
  phoneNumber: string
}

export interface WithdrawRequest {
  amount: number
  provider: PaymentProvider
  phoneNumber: string
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}
