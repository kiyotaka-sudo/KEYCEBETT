import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBetSlipStore } from '@/store/betSlipStore'
import { Ticket } from 'lucide-react'

export const BetSlipToggle: React.FC = () => {
  const { selections, isBetSlipOpen, setBetSlipOpen } = useBetSlipStore()
  
  const count = selections.length

  return (
    <AnimatePresence>
      {!isBetSlipOpen && count > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setBetSlipOpen(true)}
          className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-30 w-14 h-14 bg-primary text-secondary rounded-full shadow-glow flex items-center justify-center animate-bounce-soft"
        >
          <Ticket size={24} />
          <motion.div
            key={count}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-danger text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-secondary"
          >
            {count}
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
