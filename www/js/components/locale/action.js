// @flow

import {localeConst} from './const';

export type LocaleNameType = 'en-US' | 'ru-RU';

export type SetLocaleType = {|
    +type: 'locale__set-locale',
    +payload: {|
        +localeName: LocaleNameType
    |}
|};

export function setLocale(localeName: LocaleNameType): SetLocaleType {
    return {
        type: localeConst.action.type.setLocale,
        payload: {
            localeName
        }
    };
}
