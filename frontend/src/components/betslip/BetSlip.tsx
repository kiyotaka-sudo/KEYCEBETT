import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBetSlipStore } from '@/store/betSlipStore'
import { BetSlipItem } from './BetSlipItem'
import { BetSlipSummary } from './BetSlipSummary'
import { BetSlipEmpty } from './BetSlipEmpty'
import { usePlaceBet } from '@/hooks/useBets'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export const BetSlip: React.FC = () => {
  const { 
    selections, isBetSlipOpen, setBetSlipOpen, removeSelection, clearSlip, 
    stake, setStake, getTotalOdds, getPotentialWin, betType, getSelectionCount 
  } = useBetSlipStore()
  
  const { mutate: placeBet, isPending } = usePlaceBet()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const navigate = useNavigate()

  const handlePlaceBet = () => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour parier')
      setBetSlipOpen(false)
      navigate('/login')
      return
    }

    placeBet({
      stake,
      oddIds: selections.map(s => s.oddId)
    })
  }

  return (
    <AnimatePresence>
      {isBetSlipOpen && (
        <>
          {/* Backdrop mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBetSlipOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 lg:bottom-4 lg:left-auto lg:right-4 z-50 
                       w-full lg:w-80 bg-surface glass border border-surface-2 
                       rounded-t-2xl lg:rounded-2xl shadow-2xl flex flex-col"
            style={{ maxHeight: '85vh' }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-surface-2 bg-surface-2/50 rounded-t-2xl">
              <h3 className="font-title font-semibold flex items-center">
                Mon Pari <span className="ml-2 bg-primary text-secondary text-xs px-2 py-0.5 rounded-full">{getSelectionCount()}</span>
              </h3>
              <div className="flex space-x-2">
                {selections.length > 0 && (
                  <button onClick={clearSlip} className="text-xs text-text-muted hover:text-white px-2">
                    Vider
                  </button>
                )}
                <button onClick={() => setBetSlipOpen(false)} className="text-text-muted hover:text-white">
                  ✕
                </button>
              </div>
            </div>

            {/* Content list */}
            <div className="flex-1 overflow-y-auto">
              {selections.length === 0 ? (
                <BetSlipEmpty />
              ) : (
                <div className="flex flex-col">
                  {selections.map(selection => (
                    <BetSlipItem 
                      key={selection.oddId} 
                      {...selection} 
                      onRemove={removeSelection} 
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {selections.length > 0 && (
              <BetSlipSummary
                stake={stake}
                setStake={setStake}
                totalOdds={getTotalOdds()}
                potentialWin={getPotentialWin()}
                betType={betType}
                onPlaceBet={handlePlaceBet}
                isLoading={isPending}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
