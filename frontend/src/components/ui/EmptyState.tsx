import React from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px] kb-card">
      {icon && <div className="text-text-muted mb-4 opacity-50">{icon}</div>}
      <h3 className="text-lg font-title font-semibold mb-2">{title}</h3>
      {description && <p className="text-text-muted mb-6 max-w-sm">{description}</p>}
      {action}
    </div>
  )
}
