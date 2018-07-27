// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';
import {isString} from './../../../lib/is';

type PropsType = {|
    children: Node,
    className?: string
|};

type StateType = {||};

export default class FormHeader extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props, state} = view;
        const additionClass = isString(props.className) ? ' ' + props.className : '';

        return <h4 className={style.form_header + additionClass}>{props.children}</h4>;
    }
}
