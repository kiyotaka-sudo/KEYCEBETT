import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Ticket, Activity, CreditCard, ChevronLeft } from 'lucide-react'

export const DashboardLayout: React.FC = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Aperçu' },
    { path: '/dashboard/users', icon: Users, label: 'Utilisateurs' },
    { path: '/dashboard/bets', icon: Ticket, label: 'Paris' },
    { path: '/dashboard/events', icon: Activity, label: 'Événements' },
    { path: '/dashboard/transactions', icon: CreditCard, label: 'Transactions' },
  ]

  return (
    <div className="flex min-h-screen bg-secondary">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-surface border-r border-surface-2 hidden lg:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-surface-2">
          <Link to="/" className="text-text-muted hover:text-white flex items-center text-sm font-medium">
            <ChevronLeft size={16} className="mr-1" /> Retour au site
          </Link>
        </div>
        <div className="p-4 flex flex-col space-y-1">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4 px-3">Administration</h2>
          {navItems.map(item => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-surface-2 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-surface-2 bg-surface/50 glass flex items-center px-6 sticky top-0 z-10 lg:hidden">
            <h1 className="font-title font-semibold">KeyceBet Admin</h1>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
