import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ua from './ua.json';

const savedLang = localStorage.getItem('lang');
const lang = savedLang && ['en', 'ua'].includes(savedLang) ? savedLang : 'ua';

const resources = {
    en: { translation: en },
    ua: { translation: ua }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: lang,
        fallbackLng: 'ua',
        preload: ["uk", "en"],
        detection: {
            order: ['localStorage'],
            lookupLocalStorage: 'lang',
            caches: ['localStorage']
        },
        interpolation: { escapeValue: false }
    })
    .catch(err => console.error('i18next init error:', err));