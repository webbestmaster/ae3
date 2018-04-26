// @flow

/* global window */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setSocket, setUser} from './action';
import {user} from './../../module/user';
import {socket} from './../../module/socket';
import type {GlobalStateType} from './../../app-reducer';
import type {AuthType} from './reducer';
import {store} from './../../index';

type PropsType = {|
    // setUser: (userState: UserType) => void,
    // setUser: $Call<{}, setUser>,
    auth: AuthType
|};

type StateType = {||};

class Auth extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    componentDidMount() {
        const view = this;
        const {props, state} = view;

        store.dispatch(setUser({
            id: user.getId()
        }));

        socket.attr.initialPromise.then(() => {
            store.dispatch(setSocket({
                id: socket.getId()
            }));
        });
    }

    render(): Node {
        const view = this;
        const {props, state} = view;

        return null;
    }
}

export default connect(
    (state: GlobalStateType): {} => ({
        auth: state.auth
    }),
    {
        // setUser
    }
)(Auth);
