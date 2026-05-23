import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Link } from 'react-router-dom'
import { Ticket, CreditCard, Settings, LogOut, ShieldAlert } from 'lucide-react'

export const AccountPage: React.FC = () => {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="kb-card p-6 flex items-center space-x-4 border-l-4 border-l-primary">
        <Avatar name={user.username} size="lg" />
        <div className="flex-1">
          <h1 className="text-2xl font-title font-bold">{user.username}</h1>
          <p className="text-sm text-text-muted">{user.email}</p>
        </div>
        {!user.kycVerified && (
          <div className="hidden sm:flex items-center space-x-2 text-xs font-medium text-warning bg-warning/10 px-3 py-1.5 rounded-full border border-warning/20">
            <ShieldAlert size={14} />
            <span>Non vérifié</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/account/wallet" className="kb-card p-6 flex flex-col items-center justify-center hover:bg-surface-2 transition-colors group">
          <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <CreditCard size={24} />
          </div>
          <h3 className="font-title font-semibold mb-1">Mon Portefeuille</h3>
          <p className="text-xs text-text-muted">Gérer vos dépôts et retraits</p>
        </Link>
        
        <Link to="/account/bets" className="kb-card p-6 flex flex-col items-center justify-center hover:bg-surface-2 transition-colors group">
          <div className="w-12 h-12 bg-accent/20 text-accent rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Ticket size={24} />
          </div>
          <h3 className="font-title font-semibold mb-1">Mes Paris</h3>
          <p className="text-xs text-text-muted">Historique de vos paris placés</p>
        </Link>
      </div>

      <div className="kb-card overflow-hidden">
        <div className="p-4 border-b border-surface-2 text-sm font-title font-semibold">Paramètres</div>
        <div className="divide-y divide-surface-2">
          <button className="w-full p-4 flex items-center space-x-3 hover:bg-surface-2 transition-colors text-left">
            <Settings size={20} className="text-text-muted" />
            <span>Modifier le mot de passe</span>
          </button>
          {user.role === 'ADMIN' && (
            <Link to="/dashboard" className="w-full p-4 flex items-center space-x-3 hover:bg-surface-2 transition-colors text-left text-primary">
              <ShieldAlert size={20} />
              <span>Administration</span>
            </Link>
          )}
          <button onClick={logout} className="w-full p-4 flex items-center space-x-3 hover:bg-surface-2 transition-colors text-left text-danger">
            <LogOut size={20} />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
