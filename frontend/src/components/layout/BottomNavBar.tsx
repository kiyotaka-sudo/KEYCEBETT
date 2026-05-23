import React from 'react'
import { Link } from 'react-router-dom'
import { Home, PlayCircle, Dices, User } from 'lucide-react'

export const BottomNavBar: React.FC = () => {
  const currentPath = window.location.pathname

  const navItems = [
    { id: 'sport', icon: Home, label: 'Sport', path: '/' },
    { id: 'live', icon: PlayCircle, label: 'Live', path: '/live' },
    { id: 'casino', icon: Dices, label: 'Casino', path: '/casino' },
    { id: 'account', icon: User, label: 'Compte', path: '/account' }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface glass border-t border-surface-2 pb-safe sm:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path))
          const Icon = item.icon
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-primary' : 'text-text-muted'
              }`}
            >
              <div className="relative">
                <Icon size={24} className={isActive ? 'animate-bounce-tap' : ''} />
                {isActive && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
