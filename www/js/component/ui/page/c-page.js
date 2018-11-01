// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {ComponentType, Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from '../../../redux-store-provider/app-reducer';
import style from './style.scss';
import {isString} from '../../../lib/is/is';

type ReduxPropsType = {};

type ReduxActionType = {};

const reduxAction: ReduxActionType = {};

type PassedPropsType = {|
    +children: Node,
    +className?: string
|};

type PropsType = $ReadOnly<$Exact<{
        ...$Exact<PassedPropsType>,
        ...$Exact<ReduxPropsType>,
        ...$Exact<ReduxActionType>
    }>>;

type StateType = null;

class Page extends Component<ReduxPropsType, PassedPropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props} = view;
        const additionClass = isString(props.className) ? ' ' + props.className : '';

        return <div className={style.page + additionClass}>{props.children}</div>;
    }
}

const ConnectedComponent = connect<ComponentType<Page>, PassedPropsType, ReduxPropsType, ReduxActionType>(
    (state: GlobalStateType): ReduxPropsType => ({
        // auth: state.auth
    }),
    reduxAction
)(Page);

export {ConnectedComponent as Page};
