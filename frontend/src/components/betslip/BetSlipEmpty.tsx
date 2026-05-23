import React from 'react'

export const BetSlipEmpty: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-center p-6">
      <div className="text-4xl mb-4 opacity-50">🎫</div>
      <h3 className="font-title font-medium text-lg mb-2">Votre ticket est vide</h3>
      <p className="text-sm text-text-muted">
        Ajoutez des sélections en cliquant sur les cotes des matchs pour créer votre pari.
      </p>
    </div>
  )
}
