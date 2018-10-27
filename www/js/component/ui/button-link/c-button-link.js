// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import buttonStyle from '../button/style.scss';
import {isFunction, isString} from '../../../lib/is/is';
import noop from 'lodash/noop';
import Link from 'react-router-dom/Link';

type PropsType = {|
    children: Node,
    to: string,
    className?: string,
    onClick?: () => void
|};

type StateType = {||};

export class ButtonLink extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props, state} = view;

        const additionClass = isString(props.className) ? ' ' + props.className : '';
        const onClick = isFunction(props.onClick) ? props.onClick : noop;

        return (
            <Link to={props.to} className={buttonStyle.button_wrapper + additionClass} onClick={onClick}>
                {props.children}
            </Link>
        );
    }
}
