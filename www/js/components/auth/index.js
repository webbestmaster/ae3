// @flow

/* global window */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setSocket, setUser} from './action';
import type {SetSocketType, SetUserType} from './action';
import type {SocketType, UserType} from './reducer';
import {user} from './../../module/user';
import {socket} from './../../module/socket';
import type {GlobalStateType} from './../../app-reducer';
import type {AuthType} from './reducer';
// import * as authAction from './action';
// import {store} from './../../index';

type PropsType = {|
    setUser: (userState: UserType) => SetUserType,
    setSocket: (socketState: SocketType) => SetSocketType,
    auth: AuthType
|};

type StateType = {||};

class Auth extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    componentDidMount() {
        const view = this;
        const {props} = view;

        props.setUser({id: user.getId()});

        socket.attr.initialPromise.then(() => {
            props.setSocket({id: socket.getId()});
        });
    }

    render(): Node {
        return null;
    }
}

export default connect(
    (state: GlobalStateType): {} => ({
        auth: state.auth
    }),
    {
        setUser,
        setSocket
    }
)(Auth);
