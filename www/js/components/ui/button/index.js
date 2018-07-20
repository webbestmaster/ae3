// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from './../../../app-reducer';
import uiStyle from './../ui.scss';

type PropsType = {|
    children: Node,
    onClick?: () => void,
    className?: string
|};

type StateType = {||};

export class Button extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props, state} = view;
        const additionClass = typeof props.className === 'string' ? ' ' + props.className : '';

        return (
            <div
                className={uiStyle.button + additionClass}
                onClick={typeof props.onClick === 'function' ? props.onClick : null}
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
)(Button);
