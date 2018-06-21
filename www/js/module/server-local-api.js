// @flow
import {Server as LocalServer} from './../lib/local-server/server';
import {localRequest} from './../lib/local-server/local-request';
import type {PushedStateType} from './../lib/local-server/room';

export const localServerOptions = {
    port: 8080
};

const url = 'http://www.localhost:' + localServerOptions.port + '/';

export {url as localServerUrl};

let isLocalServerRun = false;

export function run(): Promise<void> {
    if (isLocalServerRun) {
        console.error('Local Server already run.');
        return Promise.resolve();
    }

    isLocalServerRun = true;
    const localServer = new LocalServer(localServerOptions);

    return localServer.run();
}

export function localGet(localUrl: string): Promise<string> {
    return new Promise((resolve: (result: string) => void, reject: (error: Error) => void) => {
        localRequest.get(
            localUrl,
            null,
            (error: Error | null, response: mixed, body: string) => {
                if (error) {
                    reject(new Error('can not create room'));
                    return;
                }
                resolve(body);
            });
    });
}

export function localPost(localUrl: string, form: string): Promise<string> {
    const parsedForm: PushedStateType = JSON.parse(form);

    return new Promise((resolve: (result: string) => void, reject: (error: Error) => void) => {
        localRequest.post(
            localUrl,
            parsedForm,
            (error: Error | null, response: mixed, body: string) => {
                if (error) {
                    reject(new Error('can not create room'));
                    return;
                }
                resolve(body);
            });
    });
}
