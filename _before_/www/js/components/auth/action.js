// @flow

// user
// socket
import type {SocketType, UserType} from './reducer';

export type SetUserType = {|
    type: 'auth--set-user-state',
    payload: UserType
|};

export function setUser(userState: UserType): SetUserType {
    return {
        type: 'auth--set-user-state',
        payload: userState
    };
}


export type SetSocketType = {|
    type: 'auth--set-socket-state',
    payload: SocketType
|};

export function setSocket(socketState: SocketType): SetSocketType {
    return {
        type: 'auth--set-socket-state',
        payload: socketState
    };
}
