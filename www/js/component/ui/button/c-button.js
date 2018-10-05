// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';
import {isFunction, isString} from '../../../lib/is/is';

type PropsType = {|
    children: Node,
    onClick?: () => void | Promise<void>,
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
            <button
                type="button"
                className={style.button + additionClass}
                onClick={isFunction(props.onClick) ? props.onClick : null}
                onKeyPress={isFunction(props.onClick) ? props.onClick : null}
            >
                {props.children}
            </button>
        );
    }
}
