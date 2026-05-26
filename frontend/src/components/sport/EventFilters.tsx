import React from 'react'
import { useTranslation } from 'react-i18next'

interface EventFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export const EventFilters: React.FC<EventFiltersProps> = ({ activeFilter, onFilterChange }) => {
  const { t } = useTranslation()

  const filters = [
    { id: 'all', label: t('home.filters.all') },
    { id: 'today', label: t('home.filters.today') },
    { id: 'tomorrow', label: t('home.filters.tomorrow') },
    { id: 'week', label: t('home.filters.week') },
  ]

  return (
    <div className="flex space-x-2 overflow-x-auto scrollbar-hide mb-4">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            activeFilter === filter.id 
              ? 'bg-primary/20 text-primary border border-primary/30' 
              : 'bg-surface border border-surface-2 text-text-muted hover:text-white'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
