import React from 'react'
import { Skeleton } from '../ui/Skeleton'

export const EventCardSkeleton: React.FC = () => {
  return (
    <div className="kb-card p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="w-24 h-4" />
        </div>
        <Skeleton className="w-12 h-4" />
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col space-y-2 w-1/2">
          <Skeleton className="w-3/4 h-5" />
          <Skeleton className="w-2/3 h-5" />
        </div>
        <div className="flex flex-col items-end space-y-2">
          <Skeleton className="w-8 h-6" />
          <Skeleton className="w-8 h-6" />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-14 rounded-lg" />
        <Skeleton className="h-14 rounded-lg" />
        <Skeleton className="h-14 rounded-lg" />
      </div>
    </div>
  )
}
