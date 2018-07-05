// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from './../../app-reducer';
import type {LocaleType} from './reducer';

type StateType = {};
type PropsType = {|
    +locale: LocaleType
|};

export class Locale extends Component<PropsType, StateType> {
    state: StateType;
    props: PropsType;

    constructor(props: PropsType) {
        super(props);

        const view = this;
    }

    render(): Node {
        const view = this;
        const {props, state} = view;

        return (
            <span>
                {props.locale.name}
                locale
            </span>
        );
    }
}

export default connect(
    (state: GlobalStateType): {} => ({
        locale: state.locale
    }),
    {
        // setUser
    }
)(Locale);
