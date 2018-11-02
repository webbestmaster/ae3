// @flow

/* global window, IS_PRODUCTION */

/* eslint consistent-this: ["error", "view"] */

import type {ComponentType, Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from '../../redux-store-provider/app-reducer';
import type {LocaleType} from './reducer';
import {allLocales, localeConst} from './const';
import type {LangKeyType} from './translation/type';
import type {LocaleNameType} from './action';

type ReduxPropsType = {|
    +locale: LocaleType
|};

type ReduxActionType = {};

const reduxAction: ReduxActionType = {};

type PassedPropsType = {|
    +stringKey: LangKeyType
|};

type StateType = null;

export function getLocalizedString(stringKey: LangKeyType, localeName: LocaleNameType): string {
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

    return allLocales[localeName][stringKey];
}

class Locale extends Component<ReduxPropsType, PassedPropsType, StateType> {
    // eslint-disable-next-line id-match
    props: $Exact<{...ReduxPropsType, ...PassedPropsType}>;
    state: StateType;

    render(): string {
        const view = this;
        const {props} = view;

        return getLocalizedString(props.stringKey, props.locale.name);
    }
}

const ConnectedComponent = connect<ComponentType<Locale>, PassedPropsType, ReduxPropsType, ReduxActionType>(
    (state: GlobalStateType, props: PassedPropsType): ReduxPropsType => ({
        locale: state.locale,
    }),
    reduxAction
)(Locale);

export {ConnectedComponent as Locale};
