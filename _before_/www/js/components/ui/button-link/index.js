// @flow

/* global window */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from './../../../app-reducer';
import style from './../button/style.m.scss';

import {Link} from 'react-router-dom';

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
            className={style.wrapper + additionClass}>
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
