// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from './../../../app-reducer';
import servicesStyle from './../../../../css/service.scss';
import style from './style.scss';

type PropsType = {|
    children: Node,
    onClick?: () => void,
    className?: string
|};

type StateType = {||};

export class BottomBar extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props, state} = view;
        const additionClass = typeof props.className === 'string' ? ' ' + props.className : '';

        return (
            <div
                className={style.bottom_bar + additionClass}
                onClick={typeof props.onClick === 'function' ? props.onClick : null}
            >
                <div className={style.bottom_bar__text}>
                    <p className={servicesStyle.ellipsis}>
                        {props.children}
                    </p>
                </div>
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
)(BottomBar);
