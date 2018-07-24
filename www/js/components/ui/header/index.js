// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from './../../../app-reducer';
import style from './style.scss';
import servicesStyle from './../../../../css/service.scss';
import BackButton from './back-button';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';

type PropsType = {|
    children: Node[],
    className?: string
|};

type StateType = {||};

export default class Header extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props, state} = view;
        const additionClass = isString(props.className) ? ' ' + props.className : '';

        return (
            <div className={style.header + additionClass}>
                <BackButton/>
                <div className={style.header_text}>
                    <h3 className={servicesStyle.ellipsis}>
                        {props.children}
                    </h3>
                </div>
            </div>
        );
    }
}
