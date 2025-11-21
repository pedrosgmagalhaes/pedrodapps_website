import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/en/translation.json";
import esTranslation from "./locales/es/translation.json";
import ptTranslation from "./locales/pt/translation.json";

const resources = {
  en: { translation: enTranslation },
  es: { translation: esTranslation },
  pt: { translation: ptTranslation },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "pt",
    supportedLngs: ["en", "es", "pt"],
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    detection: {
      // prioriza escolha manual salva, depois navegador
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
    // Usa a flag do Vite para ambiente de desenvolvimento
    debug: typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV,
    interpolation: {
      escapeValue: false, // React já escapa por padrão
    },
  });

export default i18n;
