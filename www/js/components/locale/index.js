// @flow

/* global window, IS_PRODUCTION */

/* eslint consistent-this: ["error", "view"] */

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from './../../app-reducer';
import type {LocaleType} from './reducer';
import type {LocaleNameType} from './action';
import type {LangKeyType} from './translation/type';
// import type {LangDataType} from './translation/type';

import {ruRu} from './translation/ru-ru/data';
import {enUs} from './translation/en-us/data';

const allLocales = {
    'en-US': enUs,
    'ru-RU': ruRu
};

type StateType = {};
type PropsType = {|
    +locale: LocaleType,
    +stringKey: LangKeyType
|};

export class Locale extends Component<PropsType, StateType> {
    state: StateType;
    props: PropsType;

    getLocalizedString(): string {
        const view = this;
        const {props} = view;
        const {locale, stringKey} = props;

        if (!IS_PRODUCTION) { // eslint-disable-line id-match
            if (!stringKey) {
                console.error('stringKey is not define', stringKey);
                return 'TEXT';
            }

            if (!enUs.hasOwnProperty(stringKey)) {
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
    (state: GlobalStateType): {|
        +locale: LocaleType
    |} => ({
        locale: state.locale
    }),
    {
        // setUser
    }
)(Locale);
