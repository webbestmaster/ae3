// @flow

/* global window, document, requestAnimationFrame, Event */

export function forceWindowUpdate() {
    const {body} = document;

    if (!body) {
        console.error('body is not define');
        return;
    }

    window.dispatchEvent(new Event('resize'));

    body.style.cssText = '-webkit-transform: rotateZ(0deg); transform: rotateZ(0deg);';
    Math.max(body.offsetHeight, body.offsetWidth);

    requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'));

        body.style.cssText = '';
        Math.max(body.offsetHeight, body.offsetWidth);
    });
}
