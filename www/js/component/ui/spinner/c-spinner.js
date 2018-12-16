// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';
import classNames from 'classnames';
import {Fade} from '../fade/c-fade';

type StateType = void;

type PropsType = {
    isOpen: boolean,
    hasFade?: boolean, // default behaviour will like - true
};

export class Spinner extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props} = view;
        const {hasFade, isOpen} = props;

        return (
            <Fade isShow={isOpen}>
                <div className={classNames(style.spinner_wrapper, {[style.spinner_wrapper__fade]: hasFade !== false})}>
                    <div className={style.spinner}/>
                </div>
            </Fade>
        );
    }
}
