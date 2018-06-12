// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from './../../../app-reducer';
import style from './style.m.scss';

type PropsType = {|
    children: Node,
    onClick?: () => void,
    className?: string
|};

type StateType = {||};

export class Header extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props, state} = view;
        const additionClass = typeof props.className === 'string' ? ' ' + props.className : '';

        return (
            <h2
                className={style.header + additionClass}
                onClick={typeof props.onClick === 'function' ? props.onClick : null}
            >
                {props.children}
            </h2>
        );
    }
}

export default connect(
    (state: GlobalStateType): {} => ({
        // auth: state.auth
    }),
    {
        // setUser
    }
)(Header);
