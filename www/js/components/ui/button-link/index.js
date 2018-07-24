// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from './../../../app-reducer';
import buttonStyle from './../button/style.scss';

import Link from 'react-router-dom/Link';

type PropsType = {|
    children: Node,
    to: string,
    className?: string,
    onClick?: () => void
|};

type StateType = {||};

export default class ButtonLink extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props, state} = view;

        const additionClass = typeof props.className === 'string' ? ' ' + props.className : '';
        const onClick = typeof props.onClick === 'function' ? props.onClick : () => {
        };

        return (
            <Link
                to={props.to}
                className={buttonStyle.button + additionClass}
                onClick={onClick}
            >
                {props.children}
            </Link>
        );
    }
}
