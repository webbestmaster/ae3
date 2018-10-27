// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';
import servicesStyle from '../../../../css/service.scss';
import BackButton from './back-button/c-back-button';
import {isString} from '../../../lib/is/is';

type PropsType = {|
    children: Node | Array<Node>,
    className?: string
|};

type StateType = {||};

export class Header extends Component<PropsType, StateType> {
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
                    <h3 className={servicesStyle.ellipsis}>{props.children}</h3>
                </div>
            </div>
        );
    }
}
