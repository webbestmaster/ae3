// @flow

/* global window */

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';
import {setUser} from './action';
import User from './../../module/user';
import type {GlobalStateType} from './../../app-reducer';
import type {AuthType, UserType} from './reducer';

type PropsType = {|
    setUser: (userState: UserType) => void,
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

        props.setUser({
            id: user.getId()
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
        setUser
    }
)(Auth);
