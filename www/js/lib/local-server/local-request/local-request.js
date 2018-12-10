// @flow

/* global setTimeout, requestAnimationFrame */

/* eslint consistent-this: ["error", "localRequest"] */
import {localMaster} from '../local-master/local-master';

import type {PushedStateType} from '../room/room';

export type RequestCallBackType = (error: Error | null, response: mixed, body: string) => void;

function request(
    requestType: 'get' | 'post',
    url: string,
    form: PushedStateType,
    requestCallBack: RequestCallBackType
) {
    requestAnimationFrame(() => {
        setTimeout((): void => localMaster.triggerHttp(requestType, url, form, requestCallBack), 0);
    });
}

export function get(url: string, form: PushedStateType, requestCallBack: RequestCallBackType) {
    request('get', url, form, requestCallBack);
}

export function post(url: string, form: PushedStateType, requestCallBack: RequestCallBackType) {
    request('post', url, form, requestCallBack);
}
