// @flow

import {combineReducers} from 'redux';
import type {ActionDataType} from '../../redux-store-provider/type';
import {storeConst} from './const';

export type StoreType = {|
    +isOpenFromGame: boolean
|};

export default combineReducers({
    isOpenFromGame: (isOpenFromGame: boolean = false, actionData: ActionDataType): boolean => {
        if (actionData.type !== storeConst.action.type.setOpenFromGame) {
            return isOpenFromGame;
        }

        if (typeof actionData.payload === 'undefined') {
            return isOpenFromGame;
        }

        return actionData.payload.isOpenFromGame;
    }
});
