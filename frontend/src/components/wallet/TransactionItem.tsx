import React from 'react'
import { Transaction } from '@/types/wallet.types'
import { formatXAF } from '@/config/constants'
import { format } from 'date-fns'
import { ArrowDownLeft, ArrowUpRight, Ticket, Trophy } from 'lucide-react'

export const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  
  const getIcon = () => {
    switch (transaction.type) {
      case 'DEPOSIT': return <ArrowDownLeft size={18} className="text-green-400" />
      case 'WITHDRAWAL': return <ArrowUpRight size={18} className="text-red-400" />
      case 'BET_STAKE': return <Ticket size={18} className="text-text-muted" />
      case 'BET_WIN': return <Trophy size={18} className="text-primary" />
      default: return <ArrowDownLeft size={18} />
    }
  }

  const getLabel = () => {
    switch (transaction.type) {
      case 'DEPOSIT': return 'Dépôt'
      case 'WITHDRAWAL': return 'Retrait'
      case 'BET_STAKE': return 'Mise Pari'
      case 'BET_WIN': return 'Gain Pari'
      case 'REFUND': return 'Remboursement'
      default: return transaction.type
    }
  }

  const isPositive = ['DEPOSIT', 'BET_WIN', 'REFUND'].includes(transaction.type)

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'COMPLETED': return 'text-green-400'
      case 'PENDING': return 'text-primary'
      case 'FAILED': return 'text-danger'
      default: return 'text-text-muted'
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-surface-2 hover:bg-surface-2/30 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center">
          {getIcon()}
        </div>
        <div>
          <p className="font-medium text-sm">{getLabel()}</p>
          <div className="flex items-center space-x-2 text-xs text-text-muted mt-0.5">
            <span>{format(new Date(transaction.createdAt), 'dd/MM/yyyy HH:mm')}</span>
            <span>•</span>
            <span className={getStatusColor()}>{transaction.status}</span>
          </div>
        </div>
      </div>
      <div className={`font-mono font-bold ${isPositive ? 'text-green-400' : 'text-white'}`}>
        {isPositive ? '+' : '-'}{formatXAF(transaction.amount)}
      </div>
    </div>
  )
}
