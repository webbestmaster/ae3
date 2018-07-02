// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from './../../../app-reducer';
import iuStyle from './../ui.scss';
import servicesStyle from './../../../../css/service.scss';
import BackButton from './back-button';

type PropsType = {|
    children: Node[],
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
            <div className={iuStyle.header + additionClass}>
                <BackButton/>
                <div className={iuStyle.header_text}>
                    <h3 className={servicesStyle.ellipsis}>
                        {props.children}
                    </h3>
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
)(Header);
