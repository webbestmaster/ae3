// @flow

import type {ScreenType} from './reducer';

export type OnResizeType = {|
    type: 'system--resize',
    payload: ScreenType
|};

export function onResize(width: number, height: number): OnResizeType {
    return {
        type: 'system--resize',
        payload: {
            width,
            height
        }
    };
}
