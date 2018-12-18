// @flow

/* global window, document, requestAnimationFrame, Event */

export function forceWindowUpdate() {
    window.dispatchEvent(new Event('resize'));

    const {body} = document;

    if (!body) {
        console.error('body is not define');
        return;
    }

    body.style.cssText = ';-webkit-transform: rotateZ(0deg);';
    body.offsetHeight;
    body.style.cssText += ';-webkit-transform: none;';

    requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'));

        body.style.cssText = '-webkit-transform: rotateZ(0deg)';
        body.offsetHeight;
        body.style.cssText += ';-webkit-transform: none';
    });
}
