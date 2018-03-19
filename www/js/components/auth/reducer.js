// @flow

/* global window */

import {combineReducers} from 'redux';

// user
import type {SetUserType} from './action';

export type UserType = {|
    id: string
|};

const defaultUserState: UserType = {
    id: ''
};


// module
export type AuthType = {|
    user: UserType
|};

export default combineReducers({
    user: (userState: UserType = defaultUserState,
           {type, payload}: SetUserType): UserType => {
        if (type !== 'auth--set-user-state') {
            return userState;
        }

        return payload;
    }
});
