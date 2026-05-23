import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layouts
import { RootLayout } from './components/layout/RootLayout'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

// Hook WebSocket global
import { useWebSocket } from './hooks/useWebSocket'

// UI Store
import { useUiStore } from './store/uiStore'
import { useEffect } from 'react'

// Pages
import { HomePage } from './pages/sport/HomePage'
import { LivePage } from './pages/sport/LivePage'
import { EventDetailPage } from './pages/sport/EventDetailPage'
import { LoginForm } from './components/auth/LoginForm'
import { RegisterForm } from './components/auth/RegisterForm'

import { AccountPage } from './pages/account/AccountPage'
import { MyBetsPage } from './pages/account/MyBetsPage'
import { WalletPage } from './pages/account/WalletPage'
import { DashboardOverviewPage } from './pages/dashboard/DashboardOverviewPage'
import { DashboardUsersPage, DashboardBetsPage, DashboardEventsPage, DashboardTransactionsPage, DashboardSportsFeedPage } from './pages/dashboard/DashboardPages'
import { ResultsPage } from './pages/sport/ResultsPage'
import { CasinoPage } from './pages/casino/CasinoPage'

const App: React.FC = () => {
  // Initialisation UI (Thème et Langue)
  const initUi = useUiStore(state => state.initUi)
  useEffect(() => {
    initUi()
  }, [initUi])

  // Initialise le websocket globalement si connecté
  useWebSocket()

  return (
    <BrowserRouter>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: { background: '#2E3148', color: '#fff', borderRadius: '8px' },
          success: { iconTheme: { primary: '#00E5A0', secondary: '#2E3148' } },
          error: { iconTheme: { primary: '#FF4D6A', secondary: '#2E3148' } },
        }} 
      />
      
      <Routes>
        {/* Auth public routes */}
        <Route path="/login" element={<div className="max-w-md mx-auto mt-20 p-6 kb-card"><h2 className="text-2xl font-title font-bold mb-6 text-center">Connexion</h2><LoginForm /></div>} />
        <Route path="/register" element={<div className="max-w-md mx-auto mt-20 p-6 kb-card"><h2 className="text-2xl font-title font-bold mb-6 text-center">Inscription</h2><RegisterForm /></div>} />

        {/* Public / Authenticated Main App */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/live" element={<LivePage />} />
          <Route path="/event/:id" element={<EventDetailPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/casino" element={<CasinoPage />} />

          {/* User Account (Protected) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/bets" element={<MyBetsPage />} />
            <Route path="/account/wallet" element={<WalletPage />} />
          </Route>
        </Route>

        {/* Admin Dashboard (Protected + Role Admin) */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardOverviewPage />} />
            <Route path="/dashboard/users" element={<DashboardUsersPage />} />
            <Route path="/dashboard/bets" element={<DashboardBetsPage />} />
            <Route path="/dashboard/events" element={<DashboardEventsPage />} />
            <Route path="/dashboard/transactions" element={<DashboardTransactionsPage />} />
            <Route path="/dashboard/sports-feed" element={<DashboardSportsFeedPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
