// @flow

/* global window */

import {combineReducers} from 'redux';
import {localeConst} from './const';
import type {LocaleNameType} from './action';
import type {ActionDataType} from '../../redux-store-provider/type';

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
    +name: LocaleNameType,
|};

type ReduceMapType = {|
    +name: (localeName: LocaleNameType, actionData: ActionDataType) => LocaleNameType,
|};

export const locale = combineReducers<ReduceMapType, LocaleType>({
    name: (localeName: LocaleNameType = initialLocaleName, actionData: ActionDataType): LocaleNameType => {
        if (actionData.type !== localeConst.action.type.setLocale) {
            return localeName;
        }

        if (typeof actionData.payload === 'undefined') {
            return localeName;
        }

        return actionData.payload.localeName;
    },
});
