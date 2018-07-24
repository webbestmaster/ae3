// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from './../../../app-reducer';
import style from './style.scss';

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
        const additionClass = typeof props.className === 'string' ? ' ' + props.className : '';

        return (
            <h4 className={style.form_header + additionClass}>
                {props.children}
            </h4>
        );
    }
}
