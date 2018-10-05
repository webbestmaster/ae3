// @flow

import {LocalSocketIoClient} from '../lib/local-server/local-socket-io-client/local-socket-io-client';
import {localServerOptions} from './server-local-api';

const localSocketIoClient = new LocalSocketIoClient();

export async function run(): Promise<void> {
    const options = {
        transports: ['websocket'],
        'force new connection': true
    };

    localSocketIoClient.connect(
        'http://localhost:' + localServerOptions.port,
        options
    );

    return new Promise((resolve: () => void) => {
        localSocketIoClient.on('connect', resolve);
    });
}

export {localSocketIoClient};
