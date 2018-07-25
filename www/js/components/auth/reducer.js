// @flow

/* global window */

import {combineReducers} from 'redux';
// user
// socket
import type {SetSocketType, SetUserType} from './action';
import {authConst} from './const';

export type UserType = {|
    +id: string
|};

const defaultUserState: UserType = {
    id: ''
};

export type SocketType = {|
    +id: string
|};

const defaultSocketState: SocketType = {
    id: ''
};

// module
export type AuthType = {|
    +user: UserType,
    +socket: SocketType
|};

export default combineReducers({
    user: (userState: UserType = defaultUserState, {type, payload}: SetUserType): UserType => {
        if (type !== authConst.action.type.setUserState) {
            return userState;
        }

        return payload;
    },
    socket: (socketState: SocketType = defaultSocketState, {type, payload}: SetSocketType): SocketType => {
        if (type !== authConst.action.type.setSocketState) {
            return socketState;
        }

        return payload;
    }
});
