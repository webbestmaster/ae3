// @flow

export type OnResizePayloadType = {|
    width: number,
    height: number
|};

export type OnResizeType = {|
    type: 'resize',
    payload: OnResizePayloadType
|};

export function onResize(width: number, height: number): OnResizeType {
    return {
        type: 'resize',
        payload: {
            width,
            height
        }
    };
}
