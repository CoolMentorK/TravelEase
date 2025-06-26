import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import si from '../locales/si.json';
import ta from '../locales/ta.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources: {
      en: { translation: en },
      si: { translation: si },
      ta: { translation: ta },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })
  .then(() => {
    console.log('i18n initialized');
  })
  .catch(err => {
    console.error('i18n initialization failed:', err);
  });

export default i18n;
