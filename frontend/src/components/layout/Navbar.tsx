import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { formatXAF } from '@/config/constants'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { ThemeToggle } from '../ui/ThemeToggle'
import { LanguageToggle } from '../ui/LanguageToggle'
import { Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  const { t } = useTranslation()

  return (
    <nav className="sticky top-0 z-40 bg-surface/90 glass border-b border-surface-2">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Left: Logo & Mobile menu */}
        <div className="flex items-center space-x-4">
          <button className="sm:hidden text-white p-1">
            <Menu size={24} />
          </button>
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-title font-bold text-secondary text-xl">K</div>
            <span className="font-title font-bold text-xl hidden sm:block tracking-wide">Keyce<span className="text-primary">Bet</span></span>
          </Link>
        </div>

        {/* Center: Desktop Links */}
        <div className="hidden sm:flex items-center space-x-8">
          <Link to="/" className="text-text-primary font-medium hover:text-primary transition-colors">{t('nav.sport')}</Link>
          <Link to="/live" className="text-text-primary font-medium hover:text-primary transition-colors flex items-center">
            <span className="w-2 h-2 rounded-full bg-danger mr-2 animate-pulse-dot" />
            {t('nav.live')}
          </Link>
          <Link to="/casino" className="text-text-primary font-medium hover:text-primary transition-colors">{t('nav.casino')}</Link>
          <Link to="/results" className="text-text-primary font-medium hover:text-primary transition-colors">{t('nav.results')}</Link>
        </div>

        {/* Right: Auth / User Info */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <ThemeToggle />
          <LanguageToggle />
          
          {isAuthenticated && user ? (
            <>
              <div className="flex flex-col items-end">
                <span className="text-xs text-text-muted hidden sm:block">{t('nav.balance')}</span>
                <span className="font-mono font-bold text-primary">{formatXAF(user.balance)}</span>
              </div>
              <Link to="/account/wallet" className="hidden sm:block">
                <Button variant="primary" size="sm" className="h-9 px-4">{t('nav.deposit')}</Button>
              </Link>
              <Link to="/account">
                <Avatar name={user.username} size="sm" />
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">{t('nav.login')}</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">{t('nav.register')}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
