import i18n from 'i18next'
import LanguageDetector from "i18next-browser-languagedetector"
import {initReactI18next} from 'react-i18next'
import XHR from 'i18next-xhr-backend'
import languageEN from '../locate/en/translate.json'
import languageVN from '../locate/vn/translate.json'

i18n
.use(XHR)
.use(LanguageDetector)
.use(initReactI18next)
.init({
    resources: {
        en: languageEN,
        vn: languageVN
    },
    /* default language when load the website in browser */
    lng: "vn",
    /* When react i18next not finding any language to as default in borwser */
    fallbackLng: "vn",
    /* debugger For Development environment */
    debug: true,
    ns: ["translation"],
    defaultNS: "translation",
    keySeparator: ".",
    interpolation: {
        escapeValue: false,
        formatSeparator: ","
    },
    react: {
        wait: true,
        bindI18n: 'languageChanged loaded',
        bindStore: 'added removed',
        nsMode: 'default'
    }
})

export default i18n;