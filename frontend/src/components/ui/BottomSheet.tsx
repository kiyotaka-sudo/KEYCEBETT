import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface glass rounded-t-3xl sm:hidden border-t border-surface-2 pb-nav"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div className="flex justify-center p-3 sticky top-0 bg-surface/90 backdrop-blur-sm z-10">
              <div className="w-12 h-1.5 bg-surface-2 rounded-full" />
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
