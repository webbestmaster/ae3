// @flow

/* global window */

import {combineReducers} from 'redux';
import type {OnResizePayloadType, OnResizeType} from './action';
import type {GlobalStateType} from './../../app-reducer';

type SystemType = $PropertyType<GlobalStateType, 'system'>; // eslint-disable-line id-match
type SystemScreenType = $PropertyType<SystemType, 'screen'>; // eslint-disable-line id-match

const docElem = window.document.documentElement;

export default combineReducers({
    screen: (screenState: OnResizePayloadType = {
        width: docElem.clientWidth,
        height: docElem.clientHeight
    },
             {type, payload}: OnResizeType): SystemScreenType => {
        if (type !== 'resize') {
            return screenState;
        }

        return {
            width: payload.width,
            height: payload.height
        };
    }
});
