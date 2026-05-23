import React from 'react'
import { formatXAF } from '@/config/constants'
import { CreditCard, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface BalanceCardProps {
  balance: number
  onDepositClick: () => void
  onWithdrawClick: () => void
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, onDepositClick, onWithdrawClick }) => {
  return (
    <div className="kb-card p-6 mb-8 bg-gradient-to-br from-surface to-surface-2 border-primary/20 relative overflow-hidden">
      {/* Décoration */}
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h2 className="text-sm font-medium text-text-muted mb-1 flex items-center">
            <CreditCard size={16} className="mr-2" />
            Solde Principal
          </h2>
          <motion.div 
            key={balance}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-mono font-bold text-white tracking-tight"
          >
            {formatXAF(balance)}
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 relative z-10">
        <button 
          onClick={onDepositClick}
          className="flex items-center justify-center space-x-2 bg-primary text-secondary font-semibold py-3 rounded-xl hover:bg-primary-dark transition-colors"
        >
          <ArrowDownLeft size={18} />
          <span>Déposer</span>
        </button>
        <button 
          onClick={onWithdrawClick}
          className="flex items-center justify-center space-x-2 bg-surface-2 text-white border border-surface-2 font-semibold py-3 rounded-xl hover:border-primary/50 transition-colors"
        >
          <ArrowUpRight size={18} />
          <span>Retirer</span>
        </button>
      </div>
    </div>
  )
}
