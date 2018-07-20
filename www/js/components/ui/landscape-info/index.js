// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';

type StateType = {||};
type PropsType = {||};

export default class LandscapeInfo extends Component<PropsType, StateType> {
    constructor() {
        super();

        const view = this;

        view.state = {};
    }

    render(): Node {
        return (
            <div>
                {'\u00A0'}
            </div>
        );
    }
}
