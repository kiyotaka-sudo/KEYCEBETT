export const MIN_BET = Number(import.meta.env.VITE_MIN_BET) || 100
export const MAX_BET = Number(import.meta.env.VITE_MAX_BET) || 500_000
export const MAX_WIN = 10_000_000
export const MAX_SELECTIONS = 15
export const CURRENCY = import.meta.env.VITE_APP_CURRENCY || 'XAF'
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'KeyceBet'
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/** Formate un montant en XAF : 12500 → "12 500 XAF" */
export const formatXAF = (amount: number | string): string => {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(n) + ' XAF'
}
