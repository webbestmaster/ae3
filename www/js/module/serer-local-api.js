// @flow
import {Server as LocalServer} from './../lib/local-server/server';
import {localRequest} from './../lib/local-server/local-request';
import type {PushedStateType} from "./../lib/local-server/room";

const localServerOptions = {
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

export function localGet(url: string): Promise<Error | null |> {
    return new Promise((resolve: (data: string) => void, reject: (err: Error | null) => void) => {
        localRequest.get(url, null, (error: Error | null, response: mixed, body: string) => error ? reject(error) : resolve(JSON.parse(body)));
    });
}

/*
export function localPost(url: string, params): Promise<any> {
    return new Promise((resolve, reject) => {
        localRequest
            .get(url, null,
                (error, response, body) => error ? reject(error) : resolve(JSON.parse(body)));
    });
}
*/
