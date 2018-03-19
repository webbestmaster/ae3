// @flow

import type {UserType} from './reducer';

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
