// @flow

/* global window */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {onResize} from './action';
// import type {GlobalStateType} from './../../app-reducer';

type PropsType = {|
    onResize: (width: number, height: number) => void
|};

type StateType = {||};

class System extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    componentDidMount() {
        const view = this;
        const {props, state} = view;

        window.addEventListener('resize',
            () => {
                const {documentElement} = window.document;
                const width: number = documentElement.clientWidth;
                const height: number = documentElement.clientHeight;

                props.onResize(width, height);
            },
            false);
    }

    render(): Node {
        return null;
    }
}

export default connect(
    (state: {}): {} => ({
        // app: state.app
    }),
    {
        onResize
    }
)(System);
