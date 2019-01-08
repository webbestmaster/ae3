// @flow

/* global setTimeout */

import type {SocketMessageType} from '../module/socket';
import {Queue} from './queue/queue';

type CallBackType = (message: SocketMessageType) => Promise<boolean>;

const callBackList: Array<CallBackType> = [];

export function subscribeOnPushStateDone(callBack: CallBackType): CallBackType {
    callBackList.push(callBack);
    console.warn(' ---> subscribeOnPushStateDone');
    return callBack;
}

export function unSubscribeOnPushStateDone(callBack: CallBackType) {
    const subscriberIndex = callBackList.indexOf(callBack);

    if (subscriberIndex === -1) {
        console.error('callBack is not in callBackList', callBack, callBackList);
        return;
    }

    console.warn(' ---> unSubscribeOnPushStateDone');

    callBackList.splice(subscriberIndex, 1);
}

export async function onPushStateDone(message: SocketMessageType) {
    const queue = new Queue();

    callBackList.forEach((callBack: CallBackType) => {
        queue.push(async () => {
            const result = await callBack(message);

            if (result === false) {
                unSubscribeOnPushStateDone(callBack);
            }
        });
    });

    await queue.push(() => {
        console.log('onPushStateDone - queue done');
    });
}
