// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';
import {isString} from '../../../lib/is/is';

type PropsType = {|
    children: Node,
    className?: string,
|};

type StateType = {||};

export class Fieldset extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props, state} = view;
        const additionClass = isString(props.className) ? ' ' + props.className : '';

        return <fieldset className={style.fieldset + additionClass}>{props.children}</fieldset>;
    }
}
