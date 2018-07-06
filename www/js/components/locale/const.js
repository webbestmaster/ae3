// @flow

/* global window, PROJECT_ID */

import type {LocaleNameType} from './action';

const localeNameList: Array<LocaleNameType> = ['ru-RU', 'en-US'];

export const localeConst = {
    action: {
        type: {
            setLocale: 'locale__set-locale'
        }
    },
    defaults: {
        localeName: 'en-US'
    },
    key: {
        localStorage: {
            localeName: PROJECT_ID + '-locale-name' // eslint-disable-line id-match
        }
    },
    localeNameList,
    langName: {
        'ru-RU': 'Русский',
        'en-US': 'English'
    }
};

import {ruRu} from './translation/ru-ru/data';
import {enUs} from './translation/en-us/data';

export const allLocales = {
    'en-US': enUs,
    'ru-RU': ruRu
};
