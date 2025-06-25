import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json' with { type: "json" };
import si from '../locales/si.json' with { type: "json" };
import ta from '../locales/ta.json' with { type: "json" };

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: { translation: en },
    si: { translation: si },
    ta: { translation: ta },
  },
  lng: 'en',              // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,   // react already escapes by default
  },
});

export default i18n;