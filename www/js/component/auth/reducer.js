// @flow

/* global window */

import {combineReducers} from 'redux';
import {authConst} from './const';
import type {ActionDataType} from '../../redux-store-provider/type';

export type UserType = {|
    +id: string,
|};

const defaultUserState: UserType = {
    id: '',
};

export type SocketType = {|
    +id: string,
|};

const defaultSocketState: SocketType = {
    id: '',
};

// module
export type AuthType = {|
    +user: UserType,
    +socket: SocketType,
|};

type ReduceMapType = {|
    +user: (userState: UserType, actionData: ActionDataType) => UserType,
    +socket: (socketState: SocketType, actionData: ActionDataType) => SocketType,
|};

export const auth = combineReducers<ReduceMapType, AuthType>({
    user: (userState: UserType = defaultUserState, actionData: ActionDataType): UserType => {
        if (actionData.type !== authConst.action.type.setUserState) {
            return userState;
        }

        if (typeof actionData.payload === 'undefined') {
            return userState;
        }

        return actionData.payload;
    },
    socket: (socketState: SocketType = defaultSocketState, actionData: ActionDataType): SocketType => {
        if (actionData.type !== authConst.action.type.setSocketState) {
            return socketState;
        }

        if (typeof actionData.payload === 'undefined') {
            return socketState;
        }

        return actionData.payload;
    },
});
