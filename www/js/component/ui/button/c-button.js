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

export class Button extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props, state} = view;
        const additionClass = isString(props.className) ? ' ' + props.className : '';
        const handleOnClick = isFunction(props.onClick) ? props.onClick : null;

        return (
            <div className={style.button_wrapper + additionClass}>
                <button type="button" className={style.button} onClick={handleOnClick} onKeyPress={handleOnClick}>
                    {props.children}
                </button>
            </div>
        );
    }
}
