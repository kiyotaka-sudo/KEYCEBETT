import { create } from 'zustand'
import { BetSlipSelection, BetType } from '@/types/bet.types'
import { MIN_BET, MAX_BET, MAX_WIN, MAX_SELECTIONS } from '@/config/constants'
import toast from 'react-hot-toast'

interface BetSlipState {
  selections: BetSlipSelection[]
  stake: number
  betType: BetType
  isBetSlipOpen: boolean
  
  // Actions
  toggleSelection: (selection: BetSlipSelection) => void
  removeSelection: (oddId: number) => void
  clearSlip: () => void
  setStake: (amount: number) => void
  setBetType: (type: BetType) => void
  setBetSlipOpen: (isOpen: boolean) => void
  
  // Computed (getters)
  getTotalOdds: () => number
  getPotentialWin: () => number
  getSelectionCount: () => number
}

export const useBetSlipStore = create<BetSlipState>((set, get) => ({
  selections: [],
  stake: MIN_BET,
  betType: 'SIMPLE',
  isBetSlipOpen: false,

  toggleSelection: (newSelection) => {
    const { selections } = get()
    
    // Si déjà présent, on le retire
    if (selections.some((s) => s.oddId === newSelection.oddId)) {
      set({
        selections: selections.filter((s) => s.oddId !== newSelection.oddId),
        betType: selections.length - 1 <= 1 ? 'SIMPLE' : 'COMBINED'
      })
      return
    }

    // Vérification: Max 15 sélections
    if (selections.length >= MAX_SELECTIONS) {
      toast.error(`Maximum ${MAX_SELECTIONS} sélections autorisées`)
      return
    }

    // Vérification: Pas deux sélections du même événement
    if (selections.some((s) => s.eventId === newSelection.eventId)) {
      toast.error("Vous ne pouvez pas sélectionner deux cotes du même match")
      return
    }

    set({
      selections: [...selections, newSelection],
      betType: selections.length + 1 > 1 ? 'COMBINED' : 'SIMPLE',
      isBetSlipOpen: true, // Ouvre automatiquement le betslip
    })
  },

  removeSelection: (oddId) => {
    const newSelections = get().selections.filter((s) => s.oddId !== oddId)
    set({
      selections: newSelections,
      betType: newSelections.length <= 1 ? 'SIMPLE' : 'COMBINED'
    })
  },

  clearSlip: () => set({ selections: [], stake: MIN_BET, betType: 'SIMPLE', isBetSlipOpen: false }),

  setStake: (amount) => {
    set({ stake: amount })
  },

  setBetType: (type) => set({ betType: type }),

  setBetSlipOpen: (isOpen) => set({ isBetSlipOpen: isOpen }),

  getTotalOdds: () => {
    const { selections, betType } = get()
    if (selections.length === 0) return 0
    if (betType === 'SIMPLE' && selections.length === 1) return selections[0].oddValue
    if (betType === 'COMBINED') {
      return selections.reduce((total, s) => total * s.oddValue, 1)
    }
    // Pour des paris simples multiples (pas implémenté pour l'instant, on assume 1 stake global)
    return selections[0].oddValue 
  },

  getPotentialWin: () => {
    const win = get().stake * get().getTotalOdds()
    return win > MAX_WIN ? MAX_WIN : win
  },

  getSelectionCount: () => get().selections.length,
}))
