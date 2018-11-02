// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {ComponentType, Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {OnResizeType} from './action';
import {onResize} from './action';
import type {GlobalStateType} from '../../redux-store-provider/app-reducer';

type ReduxPropsType = {};

type ReduxActionType = {|
    +onResize: (width: number, height: number) => OnResizeType
|};

const reduxAction: ReduxActionType = {
    onResize,
};

type PassedPropsType = {};

type PropsType = $ReadOnly<$Exact<{
        ...$Exact<PassedPropsType>,
        ...$Exact<ReduxPropsType>,
        ...$Exact<ReduxActionType>
    }>>;

type StateType = null;

class System extends Component<ReduxPropsType, PassedPropsType, StateType> {
    props: PropsType;
    state: StateType;

    componentDidMount() {
        const view = this;
        const {props} = view;

        window.addEventListener(
            'resize',
            () => {
                const {documentElement} = window.document;
                const width = documentElement.clientWidth;
                const height = documentElement.clientHeight;

                props.onResize(width, height);
            },
            false
        );
    }

    render(): Node {
        return null;
    }
}

const ConnectedComponent = connect<ComponentType<System>, PassedPropsType, ReduxPropsType, ReduxActionType>(
    (state: GlobalStateType): ReduxPropsType => ({}),
    reduxAction
)(System);

export {ConnectedComponent as System};
