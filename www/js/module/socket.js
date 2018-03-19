// @flow

const socketIoClient = require('socket.io-client');

import appConst from './../app-const';

type AttrType = {|
    initialPromise: Promise<Socket>, // eslint-disable-line no-use-before-define
    socket: { id: string } | null
|};

export default class Socket {
    attr: AttrType;

    constructor() {
        const socket = this; // eslint-disable-line consistent-this

        const initialPromise = socket.initSocket();

        socket.attr = {
            initialPromise,
            socket: null
        };
    }

    initSocket(): Promise<Socket> {
        const socket = this; // eslint-disable-line consistent-this

        if (socket.attr && socket.attr.socket) {
            return Promise.resolve(socket);
        }

        return new Promise((resolve: (socket: Socket) => void) => {
            const options = {
                transports: ['websocket'],
                'force new connection': true
            };

            const socketIo = socketIoClient.connect(appConst.api.url, options);

            socketIo.on('message', (message: string | void) => {
                console.log('from server', message);
            });

            socketIo.on('connect', () => {
                console.log('socket connected');
                socket.attr.socket = socketIo;
                resolve(socket);
            });
        });
    }

    getId(): string {
        const socket = this; // eslint-disable-line consistent-this
        const {attr} = socket;

        if (attr.socket === null) {
            return '';
        }

        return attr.socket.id;
    }
}

// const socket = '';
/*
const socketModel = new Socket();

export {socketModel as socket};
*/
