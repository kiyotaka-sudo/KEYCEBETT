import React from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { CasinoGame } from '@/types/casino.types'
import toast from 'react-hot-toast'

interface CasinoComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
  game: CasinoGame | null
}

export const CasinoComingSoonModal: React.FC<CasinoComingSoonModalProps> = ({ isOpen, onClose, game }) => {
  if (!game) return null

  const handleNotify = () => {
    toast.success(`Nous vous préviendrons dès la sortie de ${game.name} !`)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ouverture Prochaine">
      <div className="text-center py-4">
        <div className="text-5xl mb-4">🤫</div>
        <h4 className="font-title font-semibold text-lg mb-2">{game.name} arrive bientôt !</h4>
        <p className="text-sm text-text-muted mb-6">
          Ce jeu de {game.provider} n'est pas encore disponible sur KeyceBet.
          Restez connecté pour être parmi les premiers à décrocher le jackpot !
        </p>
        <Button variant="primary" className="w-full" onClick={handleNotify}>
          Me notifier à la sortie
        </Button>
      </div>
    </Modal>
  )
}
