// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from './../../../app-reducer';
import buttonStyle from './../button/style.scss';
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
import noop from 'lodash/noop';
import Link from 'react-router-dom/Link';

type PropsType = {|
    children: Node,
    to: string,
    className?: string,
    onClick?: () => void
|};

type StateType = {||};

export default class ButtonLink extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props, state} = view;

        const additionClass = isString(props.className) ? ' ' + props.className : '';
        const onClick = isFunction(props.onClick) ? props.onClick : noop;

        return (
            <Link
                to={props.to}
                className={buttonStyle.button + additionClass}
                onClick={onClick}
            >
                {props.children}
            </Link>
        );
    }
}
