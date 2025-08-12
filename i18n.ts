// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import uzCommon from "./public/locales/uz/common.json";
import ruCommon from "./public/locales/ru/common.json";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    fallbackLng: "uz",
    supportedLngs: ["uz", "ru"],
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      uz: {
        common: uzCommon,
      },
      ru: {
        common: ruCommon,
      },
    },
    ns: ["common"],
    defaultNS: "common",
  });
}

export default i18n;
