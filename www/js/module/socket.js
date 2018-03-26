// @flow

const socketIoClient = require('socket.io-client');

import appConst from './../app-const';
import MainModel from './../lib/main-model/index';
import type {PushedStatePayloadType} from './server-api';

type AttrType = {|
    initialPromise: Promise<Socket>, // eslint-disable-line no-use-before-define
    socket: { id: string } | null,
    model: MainModel
|};

export default class Socket {
    attr: AttrType;

    constructor() {
        const socket = this; // eslint-disable-line consistent-this

        const initialPromise = socket.initSocket();

        socket.attr = {
            initialPromise,
            socket: null,
            model: new MainModel()
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
                console.log('---> SW:', message);

                socket.attr.model.trigger('message', message);
            });

            socketIo.on('connect', () => {
                console.log('---> socket connected');
                socket.attr.socket = socketIo;
                socket.attr.model.trigger('connect');
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
const socketModel = new Socket();

export {socketModel as socket};


// socket message
type SocketMessageJoinIntoRoomType = {|
    +roomId: string,
    +type: 'room__join-into-room',
    +states: {|
        +last: {|
            +roomId: string,
            +socketId: string,
            +type: 'room__join-into-room',
            +userId: string
        |},
        length: number
    |}
|};

type SocketMessageLeaveFromRoomType = {|
    +roomId: string,
    +type: 'room__leave-from-room',
    +states: {|
        +last: {|
            +roomId: string,
            +type: 'room__leave-from-room',
            +userId: string
        |},
        length: number
    |}
|};

type SocketMessageUserDisconnectedFromRoomType = {|
    +roomId: string,
    +type: 'room__user-disconnected',
    +states: {|
        +last: {|
            +roomId: string,
            +type: 'room__user-disconnected',
            +userId: string
        |},
        length: number
    |}
|};

type SocketMessageTakeTurnType = {|
    +roomId: string,
    +type: 'room__take-turn',
    +states: {|
        +last: {|
            +roomId: string,
            +type: 'room__take-turn',
            +activeUserId: string // !!! instead of userId, new active user
        |},
        length: number
    |}
|};

type SocketMessageDropTurnType = {|
    +roomId: string,
    +type: 'room__drop-turn',
    +states: {|
        +last: {|
            +roomId: string,
            +type: 'room__drop-turn',
            +activeUserId: string // !!! instead of userId, user who drop turn
        |},
        length: number
    |}
|};

type SocketMessagePushStateType = {|
    +roomId: string,
    +type: 'room__push-state',
    +states: {|
        +last: {|
            +type: 'room__push-state',
            +state: PushedStatePayloadType
        |},
        length: number
    |}
|};

export type SocketMessageType = SocketMessageJoinIntoRoomType
    | SocketMessageLeaveFromRoomType
    | SocketMessageUserDisconnectedFromRoomType
    | SocketMessageTakeTurnType
    | SocketMessageDropTurnType
    | SocketMessagePushStateType;
