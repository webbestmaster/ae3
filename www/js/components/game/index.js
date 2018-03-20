// @flow

/* global window */

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';
import {user} from './../../module/user';
import {socket} from './../../module/socket';
import type {GlobalStateType} from './../../app-reducer';
import {store} from '../../index';

type PropsType = {|
|};

type StateType = {||};

class Game extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props, state} = view;

        return <div>
            <h1>game</h1>
        </div>;
    }
}

export default connect(
    (state: GlobalStateType): {} => ({
    }),
    {
        // setUser
    }
)(Game);
