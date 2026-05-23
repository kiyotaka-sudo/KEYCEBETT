import React from 'react'

export const CasinoBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-surface-2 to-surface border border-primary/20 p-6 sm:p-10 mb-8">
      {/* Decors en fond */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-20 pointer-events-none">
        <span className="text-9xl">🎰</span>
      </div>
      
      <div className="relative z-10 max-w-lg">
        <div className="inline-flex items-center space-x-2 bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Ouverture Prochaine
        </div>
        <h1 className="text-3xl sm:text-4xl font-title font-bold mb-4">
          Le Casino <span className="text-gradient">KeyceBet</span>
        </h1>
        <p className="text-text-muted mb-6">
          Les meilleurs jeux de Crash, Machines à sous et Casino en direct arrivent bientôt. Préparez-vous à une expérience inédite au Cameroun !
        </p>
        
        {/* Compteur fictif */}
        <div className="flex space-x-4 font-mono">
          <div className="flex flex-col items-center bg-surface-2 px-4 py-2 rounded-lg border border-surface">
            <span className="text-2xl font-bold text-white">14</span>
            <span className="text-[10px] text-text-muted uppercase">Jours</span>
          </div>
          <div className="flex flex-col items-center bg-surface-2 px-4 py-2 rounded-lg border border-surface">
            <span className="text-2xl font-bold text-white">08</span>
            <span className="text-[10px] text-text-muted uppercase">Heures</span>
          </div>
        </div>
      </div>
    </div>
  )
}
