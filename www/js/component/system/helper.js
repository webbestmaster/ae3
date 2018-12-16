// @flow

/* global document */

import style from './style.css';

export function setIsGlobalScrollEnable(isEnable: boolean) {
    const {body} = document;

    if (body === null) {
        console.log('body is not defined');
        return;
    }

    const {classList} = body;

    if (isEnable) {
        classList.remove(style.no_scroll_y);
    } else {
        classList.add(style.no_scroll_y);
    }
}
