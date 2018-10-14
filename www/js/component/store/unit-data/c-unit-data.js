// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from '../../../redux-store-provider/app-reducer';
import type {ContextRouterType} from '../../../type/react-router-dom-v4';
import style from './style.scss';

type ReduxPropsType = {|
    +reduxProp: boolean
|};

type ReduxActionType = {
    // +setSmth: (smth: string) => string
};

const reduxAction: ReduxActionType = {
    // setSmth // imported from actions
};

type PassedPropsType = {|
    +passedProp: string
|};

type PropsType = $ReadOnly<$Exact<{
        ...$Exact<PassedPropsType>,
        ...$Exact<ReduxPropsType>,
        ...$Exact<ReduxActionType>,
        ...$Exact<ContextRouterType>,
        +children: Node
    }>>;

type StateType = {|
    +state: number
|};

class UnitData extends Component<ReduxPropsType, PassedPropsType, StateType> {
    props: PropsType;
    state: StateType;

    constructor(props: PropsType) {
        super(props);

        const view = this;

        view.state = {
            state: 0
        };
    }

    render(): Node {
        const view = this;
        const {props, state} = view;

        return (
            <div>
                {'\u00A0 - &nbsp;'}
                {'\u2026 - ...'}
            </div>
        );
    }
}

export default connect(
    (state: GlobalStateType, props: PassedPropsType): ReduxPropsType => ({
        reduxProp: true
    }),
    reduxAction
)(UnitData);
