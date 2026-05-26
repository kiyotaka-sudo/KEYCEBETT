import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { BottomNavBar } from './BottomNavBar'
import { Footer } from './Footer'

export const RootLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-24 sm:pb-6 relative">
        <Outlet />
      </main>
      <Footer />
      <BottomNavBar />
      {/* BetSlipDrawer sera intégré ici plus tard au-dessus de tout */}
    </div>
  )
}
