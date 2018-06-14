// @flow

/* global localStorage, navigator */

import langRuRu from './langs/ru-ru';
import langEnUs from './langs/en-us';


type KeysType = $Keys<typeof langEnUs>; // eslint-disable-line id-match

export type LangTranslateType = {
    +[KeysType]: string
};

type I18nType = {|
    +'en-US': LangTranslateType,
    +'ru-RU': LangTranslateType
|};

const i18n: I18nType = {
    'en-US': langEnUs,
    'ru-RU': langRuRu
};

type LocaleNameType = $Keys<typeof i18n>; // eslint-disable-line id-match

const lsLocaleKey = 'LS_LOCALE_KEY';
const defaultLocale: LocaleNameType = 'en-US';
let currentLocale: LocaleNameType = defaultLocale;

export function setLocale(locale: LocaleNameType) {
    localStorage.setItem(lsLocaleKey, locale);
    currentLocale = locale;
}

export function getLocale(): LocaleNameType {
    return currentLocale;
}

export function getTranslate(key: KeysType): string {
    return i18n[currentLocale][key] || i18n[defaultLocale][key];
}

getTranslate('title_page__button__create_game');

// define locale
(function defineLocale() {
    const savedLocale: string = localStorage.getItem(lsLocaleKey) || navigator.language;

    // if i18n has ane locale, check for support
    if (i18n.hasOwnProperty(savedLocale)) {
        // $FlowFixMe
        currentLocale = savedLocale;
    }
})();

