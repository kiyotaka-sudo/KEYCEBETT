import React from 'react'
import { EmptyState } from '@/components/ui/EmptyState'

export const DashboardUsersPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-title font-bold mb-6">Gestion des Utilisateurs</h1>
      <div className="kb-card">
        <EmptyState 
          title="Tableau des utilisateurs" 
          description="Liste de tous les inscrits. API : GET /api/admin/users. Permet de bloquer/débloquer ou vérifier le KYC."
          icon="👥"
        />
      </div>
    </div>
  )
}

export const DashboardBetsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-title font-bold mb-6">Gestion des Paris</h1>
      <div className="kb-card">
        <EmptyState 
          title="Tous les paris" 
          description="Historique global. API : GET /api/admin/bets. Permet le règlement manuel en cas de problème."
          icon="🎫"
        />
      </div>
    </div>
  )
}

export const DashboardEventsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-title font-bold mb-6">Gestion des Événements</h1>
      <div className="kb-card">
        <EmptyState 
          title="Création & Cotes" 
          description="Interface pour créer un match manuellement ou ajuster les cotes. API : POST /api/admin/events."
          icon="⚽"
        />
      </div>
    </div>
  )
}

export const DashboardTransactionsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-title font-bold mb-6">Transactions & Paiements</h1>
      <div className="kb-card">
        <EmptyState 
          title="Dépôts & Retraits" 
          description="Supervision des flux Mobile Money. API : GET /api/admin/transactions."
          icon="💸"
        />
      </div>
    </div>
  )
}

export const DashboardSportsFeedPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-title font-bold mb-6">API Sports Feed (AMI 2)</h1>
      <div className="kb-card">
        <EmptyState 
          title="Configuration Fournisseur" 
          description="Status de la connexion WebSocket avec SportRadar / API-Football. Logs de synchronisation."
          icon="📡"
        />
      </div>
    </div>
  )
}
