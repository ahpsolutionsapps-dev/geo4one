// Import Dependencies
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Local Imports
import { type LocaleCode, supportedLanguages } from "./langs";
import esTranslations from "./locales/es/translations.json";
import enTranslations from "./locales/en/translations.json";
import arTranslations from "./locales/ar/translations.json";

// ----------------------------------------------------------------------

export const defaultLang: LocaleCode = "es";
export const fallbackLang: LocaleCode = "es";

const initialLng = "es";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translations: esTranslations },
      en: { translations: enTranslations },
      ar: { translations: arTranslations },
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "i18nextLng",
      lookupSessionStorage: "i18nextLng",
    },
    fallbackLng: fallbackLang,
    lng: initialLng,
    supportedLngs: supportedLanguages,
    ns: ["translations"],
    defaultNS: "translations",
    interpolation: {
      escapeValue: false,
    },
    lowerCaseLng: true,
    debug: false,
  });

i18n.languages = supportedLanguages;

export default i18n;
