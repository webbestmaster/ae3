// @flow

/* global window */

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';
import {setUser, setSocket} from './action';
import User from './../../module/user';
import Socket from './../../module/socket';
import type {GlobalStateType} from './../../app-reducer';
import type {AuthType, UserType} from './reducer';
import {store} from '../../index';

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

        const user = new User();

        store.dispatch(setUser({
            id: user.getId()
        }));

        const socket = new Socket();

        socket.attr.initialPromise.then(() => {
            store.dispatch(setSocket({
                id: socket.getId()
            }));
        });
    }

    render(): Node {
        const view = this;
        const {props, state} = view;

        return <div>
            {JSON.stringify(props.auth.user)}
        </div>;
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