// @flow

/* global setTimeout, URL */

/* eslint consistent-this: ["error", "localSocketIoClient"] */
import {localMaster} from '../local-master/local-master';
import {LocalSocketIoServer} from '../local-socket-io-server/local-socket-io-server';

type EventNameType = 'message' | 'connect' | 'disconnect';

type ListenerType = {|
    +eventName: EventNameType,
    +callBack: (data: mixed) => void | Promise<void>,
|};

type AttrType = {|
    +listenerList: Array<ListenerType>,
    url: string,
    options: mixed,
|};

export class LocalSocketIoClient {
    attr: AttrType;
    id: string;

    constructor() {
        const localSocketIoClient = this;

        localSocketIoClient.id = 'local-socket-id-' + Math.random();

        localSocketIoClient.attr = {
            listenerList: [],
            url: '',
            options: null,
        };
    }

    connect(url: string, options?: mixed) {
        const localSocketIoClient = this;

        localSocketIoClient.attr.url = url;
        localSocketIoClient.attr.options = options;

        localMaster.attr.socketIoServerList.forEach((socketIoServer: LocalSocketIoServer) => {
            const urlObject = new URL(url);

            if (parseInt(urlObject.port, 10) === parseInt(socketIoServer.attr.localHttpServer.attr.port, 10)) {
                socketIoServer.connectSocket(localSocketIoClient);
            }
        });

        setTimeout((): void => localSocketIoClient.trigger('connect', null), 0);
    }

    disconnect() {
        const localSocketIoClient = this;

        // localSocketIoClient.attr.url = url;
        // localSocketIoClient.attr.options = options;

        // localMaster.attr.socketIoServerList.forEach((socketIoServer: LocalSocketIoServer) => {
        //     localSocketIoClient.removeAllListeners();
        //     socketIoServer.disconnectSocket(localSocketIoClient);
        // });

        setTimeout((): void => localSocketIoClient.trigger('disconnect', null), 0);
    }

    // eslint-disable-next-line id-length
    on(eventName: EventNameType, callBack: (message?: mixed) => void | Promise<void>) {
        const localSocketIoClient = this;
        const {listenerList} = localSocketIoClient.attr;

        listenerList.push({eventName, callBack});
    }

    // eslint-disable-next-line id-length
    off(eventName: EventNameType, callBack: (message?: mixed) => void | Promise<void>) {
        const localSocketIoClient = this;
        const {listenerList} = localSocketIoClient.attr;

        const listener =
            listenerList.find(
                (listenerInList: ListenerType): boolean => {
                    return listenerInList.eventName === eventName && listenerInList.callBack === callBack;
                }
            ) || null;

        if (listener === null) {
            console.error('can not find listener with', eventName, callBack);
            return;
        }

        listenerList.splice(listenerList.indexOf(listener), 1);
    }

    trigger(eventName: EventNameType, data: mixed) {
        const localSocketIoClient = this;
        const {listenerList} = localSocketIoClient.attr;

        listenerList.forEach((listener: ListenerType) => {
            if (listener.eventName === eventName) {
                listener.callBack(data);
            }
        });
    }

    removeAllListeners() {
        const localSocketIoClient = this;
        const {listenerList} = localSocketIoClient.attr;

        listenerList.splice(0, listenerList.length);
    }

    emit(eventName: 'message', data: mixed) {
        const localSocketIoClient = this;

        localSocketIoClient.trigger('message', data);
    }
}
