/* global window */

import viewConst from './const.json';

const {resize} = viewConst.type;

export function onResizeScreen() {

    const docElem = window.document.documentElement;

    return {
        type: resize,
        payload: {
            width: docElem.clientWidth,
            height: docElem.clientHeight
        }
    };

}
