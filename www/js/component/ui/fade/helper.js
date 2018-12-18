// @flow

/* global window, requestAnimationFrame, Event */

export function forceWindowUpdate() {
    window.dispatchEvent(new Event('resize'));
    requestAnimationFrame((): void => window.dispatchEvent(new Event('resize')));
}
