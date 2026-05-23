import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-muted ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`kb-input ${error ? 'border-danger focus:border-danger' : ''} ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-danger ml-1">{error}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'
