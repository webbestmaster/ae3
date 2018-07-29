// @flow

/* global window, IS_PRODUCTION */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from '../../app-reducer';
import type {LocaleType} from './reducer';
import {allLocales} from './const';
import type {LangKeyType} from './translation/type';

type StateType = {|
    stateData: string
|};

type ReduxPropsType = {|
    +locale: LocaleType
|};

type PassedPropsType = {|
    +stringKey: LangKeyType
|};

class Locale extends Component<ReduxPropsType, PassedPropsType, StateType> {
    // eslint-disable-next-line id-match
    props: $Exact<{...ReduxPropsType, ...PassedPropsType}>;
    state: StateType;

    getLocalizedString(): string {
        const view = this;
        const {props} = view;
        const {locale, stringKey} = props;

        // eslint-disable-next-line id-match
        if (!IS_PRODUCTION) {
            if (!stringKey) {
                console.error('stringKey is not define', stringKey);
                return 'TEXT';
            }

            if (!allLocales['en-US'].hasOwnProperty(stringKey)) {
                console.error('has no key stringKey', stringKey);
                return stringKey;
            }
        }

        return allLocales[locale.name][stringKey];
    }

    render(): string {
        const view = this;
        const {props} = view;

        return view.getLocalizedString();
    }
}

export default connect(
    (state: GlobalStateType, props: PassedPropsType): ReduxPropsType => ({
        locale: state.locale
    }),
    {
        // setUser
    }
)(Locale);
