import { createI18n } from 'vue-i18n'
import en from './translations/en.json'
import ge from './translations/ge.json'

export const createInstance = () => {
  return createI18n({
    locale: localStorage.getItem('app-lang') || navigator.language || 'en',
    messages: {
      en,
      'en-US': en,
      ge,
    },
  })
}

export const i18n = createInstance()
