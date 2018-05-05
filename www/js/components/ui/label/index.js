// @flow

/* global window */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from './../../../app-reducer';
import style from './style.m.scss';

type PropsType = {|
    children: Node,
    className?: string
|};

type StateType = {||};

export class Label extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props, state} = view;
        const additionClass = typeof props.className === 'string' ? ' ' + props.className : '';

        return <label className={style.label + additionClass}>
            {props.children}
        </label>;
    }
}

export default connect(
    (state: GlobalStateType): {} => ({
        // auth: state.auth
    }),
    {
        // setUser
    }
)(Label);