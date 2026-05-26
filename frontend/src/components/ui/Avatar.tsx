import React from 'react'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md' }) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg'
  }

  return (
    <div className={`flex items-center justify-center rounded-full bg-surface-2 border border-primary/30 text-primary font-title font-bold ${sizes[size]}`}>
      {initials}
    </div>
  )
}
