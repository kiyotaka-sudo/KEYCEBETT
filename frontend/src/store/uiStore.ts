import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '@/config/i18n'

type Theme = 'light' | 'dark'
type Language = 'fr' | 'en'

interface UiState {
  theme: Theme
  language: Language
  setTheme: (theme: Theme) => void
  setLanguage: (lang: Language) => void
  initUi: () => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      theme: 'dark', // Par défaut KeyceBet est sombre
      language: 'fr',
      setTheme: (theme) => {
        set({ theme })
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },
      setLanguage: (language) => {
        set({ language })
        i18n.changeLanguage(language)
      },
      initUi: () => {
        const { theme, language } = get()
        // Appliquer le thème au chargement
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        // Appliquer la langue
        i18n.changeLanguage(language)
      }
    }),
    {
      name: 'keycebet-ui-storage',
    }
  )
)
