// @flow

/* global window */

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';
import {user} from './../../module/user';
import {socket} from './../../module/socket';
import type {GlobalStateType} from './../../app-reducer';
import {store} from '../../index';
import type {SystemType} from '../system/reducer';
// import Game from './model/index';
import type {SocketMessageType} from '../../module/socket';
import * as serverApi from '../../module/server-api';
import MainModel from '../../lib/main-model';
import type {AllRoomSettingsType, ServerUserType} from '../../module/server-api';
import ReactJson from 'react-json-view';
import find from 'lodash/find';
// import Unit from './model/unit';
import type {MapUserType} from './../../maps/type';

type PropsType = {|
|};

type StateType = {|
|};

type RefsType = {|
|};

class GameView extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;
    refs: RefsType;

    constructor() {
        super();

        const view = this;

        // view.state = null;
    }

    render(): Node {
        const view = this;
        const {props, state} = view;

        return <div>
            <h1>store</h1>
            <h1>store</h1>
            <h1>store</h1>
            <h1>store</h1>
            <h1>store</h1>
            <h1>store</h1>
            <h1>store</h1>
            <h1>store</h1>
        </div>;
    }
}

export default connect(
    (state: GlobalStateType): {} => ({
        system: state.system
    }),
    {
        // setUser
    }
)(GameView);
