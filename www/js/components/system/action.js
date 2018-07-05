// @flow

import type {ScreenType} from './reducer';
import {systemConst} from './const';

export type OnResizeType = {|
    type: 'system__resize',
    payload: ScreenType
|};

export function onResize(width: number, height: number): OnResizeType {
    return {
        type: systemConst.action.type.resize,
        payload: {
            width,
            height
        }
    };
}
