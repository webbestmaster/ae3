// @flow

/* global window, IS_PRODUCTION */

/* eslint consistent-this: ["error", "view"] */

import type {ComponentType, Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from '../../redux-store-provider/reducer';
import type {LocaleType} from './reducer';
import type {LocaleNameType} from './const';
import {allLocales, localeConst} from './const';
import type {LangKeyType} from './translation/type';

type StateType = null;

type ValueMapType = {
    [key: string]: string | number,
};

type ReduxPropsType = {|
    +locale: LocaleType,
|};

type PassedPropsType = {|
    +stringKey: LangKeyType,
    +valueMap?: ValueMapType,
|};

function replacePlaceholderMap(rawString: string, valueMap: ValueMapType): string {
    let resultString = rawString;

    Object.keys(valueMap).forEach((valueKey: string) => {
        resultString = resultString.replace(`{${valueKey}}`, String(valueMap[valueKey]));
    });

    return resultString;
}

export function getLocalizedString(
    stringKey: LangKeyType,
    localeName: LocaleNameType,
    valueMap?: ValueMapType
): string {
    // eslint-disable-next-line id-match
    if (!IS_PRODUCTION) {
        if (!stringKey) {
            console.error('stringKey is not define', stringKey);
            return 'TEXT';
        }

        if (!allLocales[localeConst.defaults.localeName].hasOwnProperty(stringKey)) {
            console.error('has no key stringKey', stringKey);
            return stringKey;
        }
    }

    const resultString = allLocales[localeName][stringKey];

    return valueMap ? replacePlaceholderMap(resultString, valueMap) : resultString;
}

class Locale extends Component<ReduxPropsType, PassedPropsType, StateType> {
    // eslint-disable-next-line id-match
    props: $Exact<{...ReduxPropsType, ...PassedPropsType}>;
    state: StateType;

    render(): string {
        const view = this;
        const {props} = view;
        const {stringKey, locale, valueMap} = props;

        return getLocalizedString(stringKey, locale.name, valueMap);
    }
}

const ConnectedComponent = connect<ComponentType<Locale>, PassedPropsType, ReduxPropsType, {}>(
    (state: GlobalStateType): ReduxPropsType => ({
        locale: state.locale,
    }),
    {
        // setUser
    }
)(Locale);

export {ConnectedComponent as Locale};
