// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from './../../../app-reducer';
import servicesStyle from './../../../../css/service.scss';
import style from './style.scss';
import {
    isBoolean,
    isNumber,
    isString,
    isFunction,
    isNotBoolean,
    isNotNumber,
    isNotString,
    isNotFunction
} from './../../../lib/is';

type PropsType = {|
    children: Node,
    onClick?: () => void,
    className?: string
|};

type StateType = {||};

class BottomBar extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props, state} = view;
        const additionClass = isString(props.className) ? ' ' + props.className : '';

        return (
            <div
                className={style.bottom_bar + additionClass}
                onClick={isFunction(props.onClick) ? props.onClick : null}
            >
                <div className={style.bottom_bar__text}>
                    <p className={servicesStyle.ellipsis}>
                        {props.children}
                    </p>
                </div>
            </div>
        );
    }
}

export default connect(
    (state: GlobalStateType): {} => ({
        // auth: state.auth
    }),
    {
        // setUser
    }
)(BottomBar);
