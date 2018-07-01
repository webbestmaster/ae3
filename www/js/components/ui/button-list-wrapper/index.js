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
        const additionClass = typeof props.className === 'string' ? ' ' + props.className : '';

        return (
            <div
                className={style.button_list_wrapper + additionClass}
            >
                {props.children}
            </div>
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
)(ButtonListWrapper);
