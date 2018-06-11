// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from './../../../app-reducer';
import style from './../button/style.m.scss';

import Link from 'react-router-dom/Link';

type PropsType = {|
    children: Node,
    to: string,
    className?: string
|};

type StateType = {||};

export class ButtonLink extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props, state} = view;

        const additionClass = typeof props.className === 'string' ? ' ' + props.className : '';

        return <Link
            to={props.to}
            className={style.button + additionClass}>
            {props.children}
        </Link>;
    }
}

export default connect(
    (state: GlobalStateType): {} => ({
        // auth: state.auth
    }),
    {
        // setUser
    }
)(ButtonLink);
