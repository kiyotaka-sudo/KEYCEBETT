import React from 'react'
import { useUiStore } from '@/store/uiStore'

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useUiStore()

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr')
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center w-8 h-8 rounded-full border border-surface-2 hover:border-primary transition-colors text-xs font-bold font-title uppercase"
    >
      {language}
    </button>
  )
}
