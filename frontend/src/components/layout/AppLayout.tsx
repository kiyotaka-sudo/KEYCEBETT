import React from 'react'
import { RootLayout } from '@/components/layout/RootLayout'
import { BetSlip } from '@/components/betslip/BetSlip'
import { BetSlipToggle } from '@/components/betslip/BetSlipToggle'

// Ce composant encapsule RootLayout et y ajoute le BetSlip qui doit être "par dessus" le reste de l'app.
// On va le modifier dans App.tsx
export const AppLayout = () => {
  return (
    <>
      <RootLayout />
      <BetSlipToggle />
      <BetSlip />
    </>
  )
}
