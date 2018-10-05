// @flow

import {systemConst} from './const';

export type OnResizeType = {|
    type: 'system__resize',
    payload: {
        width: number,
        height: number
    }
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
