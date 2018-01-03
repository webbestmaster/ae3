// @flow

const socketIoClient = require('socket.io-client');

type Attr = {
    initialPromise: Promise<Socket>, // eslint-disable-line no-use-before-define
    socket: Object
}

class Socket {
    attr: Attr;
    constructor() {
        const socket = this; // eslint-disable-line consistent-this

        socket.attr = {
            initialPromise: socket.initSocket(),
            socket: {}
        };
    }

    initSocket():Promise<Socket> {
        const socket = this; // eslint-disable-line consistent-this

        if (socket.attr && socket.attr.socket.id) {
            return Promise.resolve(socket);
        }

        return new Promise((resolve, reject) => {
            const options = {
                transports: ['websocket'],
                'force new connection': true
            };

            const socketIo = socketIoClient.connect('http://localhost:3001', options);

            socketIo.on('message', message => {
                console.log('from server', message);
            });

            socketIo.on('connect', () => {
                console.log('socket connected');
                socket.attr.socket = socketIo;
                resolve(socket);
            });
        });
    }

    getId():string {
        return this.attr.socket.id;
    }
}

// const socket = '';
const socketModel = new Socket();

export {socketModel as socket};

export default Socket;
