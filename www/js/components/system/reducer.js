// @flow

/* global window */

import {combineReducers} from 'redux';
// screen
import type {OnResizeType} from './action';
import {systemConst} from './const';

export type ScreenType = {|
    width: number,
    height: number
|};

const docElem = window.document.documentElement;
const defaultScreenState: ScreenType = {
    width: docElem.clientWidth,
    height: docElem.clientHeight
};

// module
export type SystemType = {
    screen: ScreenType
};

export default combineReducers({
    screen: (screenState: ScreenType = defaultScreenState,
             {type, payload}: OnResizeType): ScreenType => {
        if (type !== systemConst.action.type.resize) {
            return screenState;
        }

        return payload;
    }
});
