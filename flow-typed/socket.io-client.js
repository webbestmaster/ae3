// @flow

type SocketIoOptionsType = {|
    transports: ['websocket'],
    'force new connection': true,
|};

// eslint-disable-next-line flowtype/no-weak-types
type SocketCallbackFunctionType = (message?: any) => void;

type SocketType = {|
    id: string,
    on(event: string, callbackFunction: SocketCallbackFunctionType): void,
|};

declare module 'socket.io-client' {
    declare export function connect(url: string, options: SocketIoOptionsType): SocketType;
}
