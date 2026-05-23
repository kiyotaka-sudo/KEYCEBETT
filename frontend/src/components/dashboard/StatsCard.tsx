import React from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: number
  trendLabel?: string
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, trendLabel }) => {
  return (
    <div className="kb-card p-5 border-l-4 border-l-primary flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-2xl font-bold font-mono text-white">{value}</h3>
        </div>
        <div className="p-2 bg-surface-2 rounded-lg text-primary">
          {icon}
        </div>
      </div>
      
      {trend !== undefined && (
        <div className="flex items-center text-xs">
          <span className={`font-semibold ${trend >= 0 ? 'text-green-400' : 'text-danger'} flex items-center`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          {trendLabel && <span className="text-text-muted ml-2">{trendLabel}</span>}
        </div>
      )}
    </div>
  )
}
