import React from 'react'

interface LeagueHeaderProps {
  name: string
  country?: string
}

export const LeagueHeader: React.FC<LeagueHeaderProps> = ({ name, country }) => {
  return (
    <div className="flex items-center space-x-2 bg-surface-2/50 px-4 py-2 rounded-lg mb-3 mt-6">
      <div className="w-1 h-4 bg-primary rounded-full"></div>
      <h3 className="font-title font-semibold text-sm">
        {country ? `${country} - ` : ''}{name}
      </h3>
    </div>
  )
}
