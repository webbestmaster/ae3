// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {SetSocketType, SetUserType} from './action';
import {setSocket, setUser} from './action';
import type {AuthType, SocketType, UserType} from './reducer';
import {user} from '../../module/user';
import {socket} from '../../module/socket';
import type {GlobalStateType} from '../../redux-store-provider/app-reducer';

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

        socket.attr.initialPromise.then((): mixed => props.setSocket({id: socket.getId()})).catch((error: Error) => {
            console.error('set socket error!');
            console.error(error);
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