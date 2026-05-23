import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useWallet, useTransactions } from '@/hooks/useWallet'
import { BalanceCard } from '@/components/wallet/BalanceCard'
import { TransactionItem } from '@/components/wallet/TransactionItem'
import { DepositForm } from '@/components/wallet/DepositForm'
import { WithdrawForm } from '@/components/wallet/WithdrawForm'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { Tabs } from '@/components/ui/Tabs'

export const WalletPage: React.FC = () => {
  const { data: wallet, isLoading: isWalletLoading } = useWallet()
  const { data: transactionsPage, isLoading: isTransLoading } = useTransactions()
  
  const [activeTab, setActiveTab] = useState('all')
  const [modalState, setModalState] = useState<'NONE' | 'DEPOSIT' | 'WITHDRAW'>('NONE')

  const transactions = transactionsPage?.content || []
  
  const filteredTransactions = transactions.filter(t => {
    if (activeTab === 'all') return true
    if (activeTab === 'deposits') return t.type === 'DEPOSIT'
    if (activeTab === 'withdrawals') return t.type === 'WITHDRAWAL'
    if (activeTab === 'bets') return t.type === 'BET_STAKE' || t.type === 'BET_WIN'
    return true
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-2xl font-title font-bold mb-6">Portefeuille</h1>

      {isWalletLoading ? (
        <div className="kb-card h-48 mb-8 skeleton" />
      ) : (
        <BalanceCard 
          balance={wallet?.balance || 0}
          onDepositClick={() => setModalState('DEPOSIT')}
          onWithdrawClick={() => setModalState('WITHDRAW')}
        />
      )}

      <div className="kb-card overflow-hidden">
        <Tabs 
          tabs={[
            { id: 'all', label: 'Toutes' },
            { id: 'deposits', label: 'Dépôts' },
            { id: 'withdrawals', label: 'Retraits' },
            { id: 'bets', label: 'Paris' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        
        <div className="divide-y divide-surface-2 min-h-[300px]">
          {isTransLoading ? (
             <div className="flex justify-center p-8"><span className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>
          ) : filteredTransactions.length === 0 ? (
            <EmptyState title="Aucune transaction" icon="💸" />
          ) : (
            filteredTransactions.map(t => <TransactionItem key={t.id} transaction={t} />)
          )}
        </div>
      </div>

      <Modal 
        isOpen={modalState === 'DEPOSIT'} 
        onClose={() => setModalState('NONE')}
        title="Effectuer un dépôt"
      >
        <DepositForm onSuccess={() => setModalState('NONE')} />
      </Modal>

      <Modal 
        isOpen={modalState === 'WITHDRAW'} 
        onClose={() => setModalState('NONE')}
        title="Retirer des fonds"
      >
        <WithdrawForm 
          onSuccess={() => setModalState('NONE')} 
          maxAmount={wallet?.balance || 0} 
        />
      </Modal>
    </motion.div>
  )
}
