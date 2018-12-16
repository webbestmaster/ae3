// @flow

/* global window, PROJECT_ID */

export type LocaleNameType = 'en-US' | 'ru-RU';

import {enUs} from './translation/en-us/data';
import {ruRu} from './translation/ru-ru/data';

export const localeNameReference: {[key: string]: LocaleNameType} = {
    enUs: 'en-US',
    ruRu: 'ru-RU',
};

export const allLocales = {
    [localeNameReference.enUs]: enUs,
    [localeNameReference.ruRu]: ruRu,
};

const localeNameList: Array<LocaleNameType> = Object.keys(localeNameReference).map(
    (localeKey: string): LocaleNameType => localeNameReference[localeKey]
);

export const localeConst = {
    action: {
        type: {
            setLocale: 'locale__set-locale',
        },
    },
    defaults: {
        localeName: localeNameReference.enUs,
    },
    key: {
        localStorage: {
            // eslint-disable-next-line id-match
            localeName: PROJECT_ID + '-locale-name-v.1.0',
        },
    },
    localeNameList,
    langName: {
        [localeNameReference.enUs]: 'Русский',
        [localeNameReference.ruRu]: 'English',
    },
};
