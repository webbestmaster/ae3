// @flow
const appConst = require('./const.json');

type resizeResult = {
    type: string,
    payload: {
        width: number,
        height: number
    }
}

export function setScreenSize(width:number, height:number):resizeResult {
    return {
        type: appConst.type.setScreenSize,
        payload: {width, height}
    };
}
