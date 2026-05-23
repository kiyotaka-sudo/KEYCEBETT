import React from 'react'

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg', className?: string }> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  }

  return (
    <div className={`inline-block animate-spin rounded-full border-solid border-primary border-r-transparent align-[-0.125em] ${sizes[size]} ${className}`} role="status">
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Chargement...
      </span>
    </div>
  )
}
