// @flow

/* global window, IS_PRODUCTION */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from './../../app-reducer';
import type {LocaleType} from './reducer';
import {allLocales} from './const';
import type {LangKeyType} from './translation/type';

type StateType = {};
type PropsType = {|
    +locale: LocaleType,
    +stringKey: LangKeyType
|};

class Locale extends Component<PropsType, StateType> {
    state: StateType;
    props: PropsType;

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
    (state: GlobalStateType): {|+locale: LocaleType|} => ({
        locale: state.locale
    }),
    {
        // setUser
    }
)(Locale);
