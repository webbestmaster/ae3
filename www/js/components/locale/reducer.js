// @flow

/* global window */

import {combineReducers} from 'redux';
import {localeConst} from './const';
import type {LocaleNameType, SetLocaleType} from './action';

function getLocaleName(): LocaleNameType {
    const savedLocaleName = window.localStorage.getItem(localeConst.key.localStorage.localeName);
    const localeNameList: Array<LocaleNameType> = localeConst.localeNameList;

    if (localeNameList.includes(savedLocaleName)) {
        return savedLocaleName;
    }

    return localeConst.defaults.localeName;
}

const initialLocaleName = getLocaleName();

export type LocaleType = {|
    +name: LocaleNameType
|};

export default combineReducers({
    name: (localeName: LocaleNameType = initialLocaleName, {type, payload}: SetLocaleType): LocaleNameType => {
        if (type !== localeConst.action.type.setLocale) {
            return localeName;
        }

        return payload.localeName;
    }
});
