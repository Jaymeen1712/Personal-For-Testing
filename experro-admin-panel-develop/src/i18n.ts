import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const options = {
  order: ['querystring', 'localStorage', 'navigator'],
  lookupQuerystring: 'lng',
  lookupLocalStorage: 'i18nextLng',
};

// @ts-ignore
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      wait: true,
      useSuspense: true, //   <---- this will do the magic
    },
    detection: options,
  });

export default i18n;
