// @flow

import type {SocketType, UserType} from './reducer';
import {authConst} from './const';

export type SetUserType = {|
    type: 'auth__set-user-state',
    payload: UserType
|};

export function setUser(userState: UserType): SetUserType {
    return {
        type: authConst.action.type.setUserState,
        payload: userState
    };
}


export type SetSocketType = {|
    type: 'auth__set-socket-state',
    payload: SocketType
|};

export function setSocket(socketState: SocketType): SetSocketType {
    return {
        type: authConst.action.type.setSocketState,
        payload: socketState
    };
}
