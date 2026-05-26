import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translationFR from '../locales/fr.json'
import translationEN from '../locales/en.json'

const resources = {
  fr: { translation: translationFR },
  en: { translation: translationEN }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // Langue par défaut, écrasée par le store plus tard
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React s'en charge déjà
    }
  })

export default i18n
