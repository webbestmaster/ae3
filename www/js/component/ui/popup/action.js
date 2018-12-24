// @flow

/* global window, CustomEvent */

import type {Node} from 'react';

export const defaultEventName = `show-popup-event ${Math.random()}`;

export type ShowPopupDetailType = {|
    +content: Node,
    +hideCallBack: () => void,
|};

export function showPopup(content: Node, customEventName?: string): Promise<void> {
    return new Promise((resolve: () => void) => {
        const detail: ShowPopupDetailType = {
            content,
            hideCallBack: (): void => resolve(),
        };

        const customEvent =
            typeof customEventName === 'string' ?
                new CustomEvent(customEventName, {detail}) :
                new CustomEvent(defaultEventName, {detail});

        window.dispatchEvent(customEvent);
    });
}
