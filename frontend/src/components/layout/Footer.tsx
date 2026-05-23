import React from 'react'
import { useTranslation } from 'react-i18next'

export const Footer: React.FC = () => {
  const { t } = useTranslation()

  return (
    <footer className="bg-secondary py-8 border-t border-surface-2 mt-auto pb-nav sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
        <div className="flex items-center space-x-2 mb-4 opacity-50">
          <span className="text-2xl">🔞</span>
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            {t('footer.responsibleGaming')}
          </p>
        </div>
        <p className="text-xs text-text-muted mb-2 max-w-lg leading-relaxed">
          {t('footer.warning')}
        </p>
        <p className="text-[10px] text-text-muted/50">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  )
}
