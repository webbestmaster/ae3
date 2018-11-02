// @flow

/* global window, PROJECT_ID */

import type {LocaleNameType} from './action';
import {ruRu} from './translation/ru-ru/data';
import {enUs} from './translation/en-us/data';

const localeNameList: Array<LocaleNameType> = ['en-US', 'ru-RU'];

export const localeConst = {
    action: {
        type: {
            setLocale: 'locale__set-locale',
        },
    },
    defaults: {
        localeName: 'en-US',
    },
    key: {
        localStorage: {
            // eslint-disable-next-line id-match
            localeName: PROJECT_ID + '-locale-name-v.1.0',
        },
    },
    localeNameList,
    langName: {
        'ru-RU': 'Русский',
        'en-US': 'English',
    },
};

export const allLocales = {
    'en-US': enUs,
    'ru-RU': ruRu,
};
