// @flow

/* eslint consistent-this: ["error", "localMasterModel"] */

import {LocalHttpServer} from '../local-http-server/local-http-server';
import {LocalSocketIoServer} from '../local-socket-io-server/local-socket-io-server';
import {getPort} from '../helper';

import type {PushedStateType} from '../room/room';

import type {RequestCallBackType} from '../local-request/local-request';

type AttrType = {|
    +httpServerList: Array<LocalHttpServer>,
    +socketIoServerList: Array<LocalSocketIoServer>,
|};

export class LocalMaster {
    attr: AttrType;

    constructor() {
        const localMasterModel = this;

        localMasterModel.attr = {
            httpServerList: [],
            socketIoServerList: [],
        };
    }

    addHttpServer(localHttpServer: LocalHttpServer) {
        const localMasterModel = this;
        const {httpServerList} = localMasterModel.attr;
        const indexOfLocalHttpServer = httpServerList.indexOf(localHttpServer);

        if (indexOfLocalHttpServer !== -1) {
            console.log('httpServerList already has localHttpServer', localMasterModel, localHttpServer);
            return;
        }

        httpServerList.push(localHttpServer);
    }

    removeHttpServer(localHttpServer: LocalHttpServer) {
        const localMasterModel = this;
        const {httpServerList} = localMasterModel.attr;
        const indexOfLocalHttpServer = httpServerList.indexOf(localHttpServer);

        if (indexOfLocalHttpServer === -1) {
            console.log('httpServerList has NO localHttpServer', localMasterModel, localHttpServer);
            return;
        }

        httpServerList.splice(indexOfLocalHttpServer, 1);
    }

    addSocketIoServer(localSocketIoServer: LocalSocketIoServer) {
        const localMasterModel = this;
        const {socketIoServerList} = localMasterModel.attr;
        const indexOfLocalSocketIoServer = socketIoServerList.indexOf(localSocketIoServer);

        if (indexOfLocalSocketIoServer !== -1) {
            console.log('socketIoServerList already has localSocketIoServer', localMasterModel, localSocketIoServer);
            return;
        }

        socketIoServerList.push(localSocketIoServer);
    }

    removeSocketIoServer(localSocketIoServer: LocalSocketIoServer) {
        const localMasterModel = this;
        const {socketIoServerList} = localMasterModel.attr;
        const indexOfLocalSocketIoServer = socketIoServerList.indexOf(localSocketIoServer);

        if (indexOfLocalSocketIoServer === -1) {
            console.log('socketIoServerList has NO localSocketIoServer', localMasterModel, localSocketIoServer);
            return;
        }

        socketIoServerList.splice(indexOfLocalSocketIoServer, 1);
    }

    triggerHttp(requestType: 'get' | 'post', url: string, form: PushedStateType, requestCallBack: RequestCallBackType) {
        const localMasterModel = this;
        const {httpServerList} = localMasterModel.attr;

        httpServerList.forEach((localHttpServer: LocalHttpServer) => {
            if (localHttpServer.attr.port !== getPort(url)) {
                return;
            }

            localHttpServer.onRequest(requestType, url, form, requestCallBack);
        });
    }
}

export const localMaster = new LocalMaster();
