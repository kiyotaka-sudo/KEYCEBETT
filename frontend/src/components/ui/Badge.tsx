import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'live'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    danger: 'bg-danger/20 text-red-400 border border-danger/30',
    warning: 'bg-primary/20 text-primary border border-primary/30',
    info: 'bg-surface-2 text-text-muted border border-surface-2',
    live: 'bg-danger/20 text-red-400 border border-danger/30 animate-pulse'
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${variants[variant]} ${className}`}>
      {variant === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-danger mr-1.5 animate-pulse-dot" />}
      {children}
    </span>
  )
}
