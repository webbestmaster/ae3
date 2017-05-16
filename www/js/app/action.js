const viewConst = require('./const.json');

export function onResizeScreen() {
    const docElem = window.document.documentElement;

    return {
        type: viewConst.type.resize,
        payload: {
            width: docElem.clientWidth,
            height: docElem.clientHeight
        }
    };
}
