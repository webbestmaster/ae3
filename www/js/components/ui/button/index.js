// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from './../../../app-reducer';
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

export default class Button extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props, state} = view;
        const additionClass = isString(props.className) ? ' ' + props.className : '';

        return (
            <div
                className={style.button + additionClass}
                onClick={isFunction(props.onClick) ? props.onClick : null}
            >
                {props.children}
            </div>
        );
    }
}
