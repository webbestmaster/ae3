// @flow

/* global window */

import {combineReducers} from 'redux';
// user
// socket
import type {SetSocketType, SetUserType} from './action';

export type UserType = {|
    id: string
|};

const defaultUserState: UserType = {
    id: ''
};


export type SocketType = {|
    id: string
|};

const defaultSocketState: SocketType = {
    id: ''
};


// module
export type AuthType = {|
    user: UserType,
    socket: SocketType
|};

export default combineReducers({
    user: (userState: UserType = defaultUserState,
           {type, payload}: SetUserType): UserType => {
        if (type !== 'auth--set-user-state') {
            return userState;
        }

        return payload;
    },
    socket: (socketState: SocketType = defaultSocketState,
             {type, payload}: SetSocketType): SocketType => {
        if (type !== 'auth--set-socket-state') {
            return socketState;
        }

        return payload;
    }
});
