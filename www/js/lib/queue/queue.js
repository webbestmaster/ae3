// @flow

/* global window, requestAnimationFrame, setTimeout */

/* eslint consistent-this: ["error", "queue"] */

type CallBackType = () => Promise<void> | void;
import {isFunction} from '../is/is';

function requestIdleCallbackPolyfill(callback: () => {}) {
    requestAnimationFrame(() => {
        setTimeout(callback, 0);
    });
}

window.requestIdleCallback = window.requestIdleCallback || requestIdleCallbackPolyfill;

export class Queue {
    list: Array<CallBackType>;
    isInProgress: boolean;

    constructor() {
        const queue = this;

        queue.list = [];
        queue.isInProgress = false;
    }

    push(func: CallBackType) {
        const queue = this;

        queue.list.push(func);

        if (queue.isInProgress) {
            return;
        }

        queue.run();
    }

    run() {
        const queue = this;

        if (queue.list.length === 0) {
            queue.isInProgress = false;
            return;
        }

        queue.isInProgress = true;
        const first = queue.list.shift();
        const result = first();

        if (result && isFunction(result.then)) {
            result
                .then((): void => queue.runCallBack())
                .catch(() => {
                    console.error('error with run callback');
                    queue.runCallBack();
                });
            return;
        }

        queue.runCallBack();
    }

    runCallBack() {
        // setTimeout(() => this.run(), 0);
        const queue = this;

        requestAnimationFrame(() => {
            window.requestIdleCallback(() => {
                queue.run();
            });
        });
    }

    destroy() {
        const queue = this;

        queue.constructor();
    }
}
