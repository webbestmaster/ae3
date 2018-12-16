// @flow

/* global window, CustomEvent */

import type {Node} from 'react';

export const defaultEventName = `show-confirm-event ${Math.random()}`;

export type GetConfirmDetailType = {|
    +content: Node,
    +applyCallBack: () => mixed,
    +cancelCallBack: () => mixed,
|};

export function getConfirm(content: Node, customEventName?: string): Promise<boolean> {
    return new Promise((resolve: (result: boolean) => mixed) => {
        const detail: GetConfirmDetailType = {
            content,
            applyCallBack: (): mixed => resolve(true),
            cancelCallBack: (): mixed => resolve(false),
        };

        const customEvent =
            typeof customEventName === 'string' ?
                new CustomEvent(customEventName, {detail}) :
                new CustomEvent(defaultEventName, {detail});

        window.dispatchEvent(customEvent);
    });
}
