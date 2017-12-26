const appConst = require('./const.json');

export function setScreenSize(width, height) {
    return {
        type: appConst.type.setScreenSize,
        payload: {width, height}
    };
}
