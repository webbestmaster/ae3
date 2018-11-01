// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {ComponentType, Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from '../../../redux-store-provider/app-reducer';
import servicesStyle from '../../../../css/service.scss';
import style from './style.scss';
import {isString} from '../../../lib/is/is';

type ReduxPropsType = {};

type ReduxActionType = {};

const reduxAction: ReduxActionType = {};

type PassedPropsType = {|
    children: Node,
    className?: string
|};

type PropsType = $ReadOnly<$Exact<{
        ...$Exact<PassedPropsType>,
        ...$Exact<ReduxPropsType>,
        ...$Exact<ReduxActionType>
    }>>;

type StateType = null;

class BottomBar extends Component<ReduxPropsType, PassedPropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props} = view;
        const additionClass = isString(props.className) ? ' ' + props.className : '';

        return (
            <div className={style.bottom_bar + additionClass}>
                <div className={style.bottom_bar__text}>
                    <p className={servicesStyle.ellipsis}>{props.children}</p>
                </div>
            </div>
        );
    }
}

const ConnectedComponent = connect<ComponentType<BottomBar>, PassedPropsType, ReduxPropsType, ReduxActionType>(
    (state: GlobalStateType): ReduxPropsType => ({
        // auth: state.auth
    }),
    reduxAction
)(BottomBar);

export {ConnectedComponent as BottomBar};
