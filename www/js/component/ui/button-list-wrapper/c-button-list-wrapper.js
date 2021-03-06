// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';
import {isString} from '../../../lib/is/is';

type PropsType = {|
    children: Node | Array<Node>,
    className?: string,
|};

type StateType = {||};

/*
type StyleType = {|
    position?: 'absolute',
    transform?: 'translate3d(-50%, -50%, 0)',
    left?: '50%',
    top?: '50%'
|} | null;
*/

export class ButtonListWrapper extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props, state} = view;
        const additionClass = isString(props.className) ? ' ' + props.className : '';

        return (
            <div className={style.button_list_wrapper + additionClass}>
                <div className={style.button_list_container}>{props.children}</div>
            </div>
        );
    }
}
