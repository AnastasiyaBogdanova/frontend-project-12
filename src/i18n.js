import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru.json';

export const createI18n = () => {
  const instance = i18n.createInstance();
  instance.use(initReactI18next).init({
    lng: 'ru',
    fallbackLng: 'ru',
    resources: { ru: { translation: ru } },
    interpolation: { escapeValue: false },
  });
  return instance;
};