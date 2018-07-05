// @flow

import {combineReducers} from 'redux';
import {localeConst} from './const';
import type {LocaleNameType, SetLocaleType} from './action';

export type LocaleType = {|
    +name: LocaleNameType
|};

export default combineReducers({
    name: (localeName: LocaleNameType = localeConst.defaults.localeName,
           {type, payload}: SetLocaleType): LocaleNameType => {
        if (type !== localeConst.action.type.setLocale) {
            return localeName;
        }

        return payload.localeName;
    }
});
