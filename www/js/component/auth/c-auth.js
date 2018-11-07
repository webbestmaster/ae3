// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {ComponentType, Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {SetSocketType, SetUserType} from './action';
import {setSocket, setUser} from './action';
import type {AuthType, SocketType, UserType} from './reducer';
import {user} from '../../module/user';
import {socket} from '../../module/socket';
import type {GlobalStateType} from '../../redux-store-provider/reducer';
import type {ActionDataType} from '../../redux-store-provider/type';

type ReduxPropsType = {|
    +auth: AuthType,
|};

type ReduxActionType = {|
    +setUser: (userState: UserType) => SetUserType,
    +setSocket: (socketState: SocketType) => SetSocketType,
|};

const reduxAction: ReduxActionType = {
    setUser,
    setSocket,
};

type PassedPropsType = {};

type PropsType = $ReadOnly<$Exact<{
        ...$Exact<PassedPropsType>,
        ...$Exact<ReduxPropsType>,
        ...$Exact<ReduxActionType>,
    }>>;

type StateType = null;

class Auth extends Component<ReduxPropsType, PassedPropsType, StateType> {
    props: PropsType;
    state: StateType;

    componentDidMount() {
        const view = this;
        const {props} = view;

        props.setUser({id: user.getId()});

        socket.attr.initialPromise
            .then((): ActionDataType => props.setSocket({id: socket.getId()}))
            .catch(
                (error: Error): Error => {
                    console.error('set socket error!');
                    console.error(error);
                    return error;
                }
            );
    }

    render(): Node {
        return null;
    }
}

const ConnectedComponent = connect<ComponentType<Auth>, PassedPropsType, ReduxPropsType, ReduxActionType>(
    (state: GlobalStateType): ReduxPropsType => ({
        auth: state.auth,
    }),
    reduxAction
)(Auth);

export {ConnectedComponent as Auth};
