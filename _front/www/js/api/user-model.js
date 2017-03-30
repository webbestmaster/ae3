import BaseModel from './../core/base-model';
import api from './';
const mainConst = require('./../../../../_main/const.json');

const userConst = {
    tokenId: 'const_tokenId',
    // staticId: 'const_staticId',
    webSocket: 'const_webSocket',
    awaitingMessages: 'const_awaitingMessages'
};

export default class UserModel extends BaseModel {

    constructor(data) {

        super(data);

        const user = this;

        user.set(userConst.awaitingMessages, []);

    }

/*
    setStaticId(staticId) {
        return this.set(userConst.staticId, staticId);
    }

    getStaticId() {
        return this.get(userConst.staticId);
    }
*/

    setTokenId(tokenId) {
        return this.set(userConst.tokenId, tokenId);
    }

    getTokenId() {
        return this.get(userConst.tokenId);
    }

    setWebSocket(webSocket) {
        return this.set(userConst.webSocket, webSocket);
    }

    getWebSocket() {
        return this.get(userConst.webSocket);
    }

    setupWebSocket() {

        const model = this;

        const webSocket = model.getWebSocket();

        if (webSocket) {
            return Promise.resolve(webSocket);
        }

        return Promise
            .all([
                api.getHostName(),
                api.getServerInfo()
            ])
            .then(([hostname, serverInfo]) => new Promise((resolve, reject) => {
                    const newWebSocket = new WebSocket('ws://' + hostname + ':' + serverInfo.WS_PORT);
                    model.setWebSocket(newWebSocket);
                    model.listenWs(newWebSocket);
                    newWebSocket.onopen = () => {
                        newWebSocket.onopen = null;
                        resolve();
                    };
                })
            );

    }

    destroyWebSocket() {

        const model = this;

        const webSocket = model.getWebSocket();

        if (webSocket) {
            model.setWebSocket(null);
            webSocket.close();
        }

    }

    listenWs(ws) {

        const model = this;

        ws.onclose = e => {
            console.warn('ws is closed');
            console.log(e);
        };

        ws.onerror = e => {
            console.error('ws is error');
            console.log(e);
        };

        ws.onmessage = message => model.onWebSocketMessage(JSON.parse(message.data));

    }

    waitMessage(message) {

        const user = this;
        const awaitingMessages = user.get(userConst.awaitingMessages);

        return new Promise((resolve, reject) => awaitingMessages.push({message, resolve, reject}));

    }

    onWebSocketMessage(message) {

        const user = this;
        let awaitingMessages = user.get(userConst.awaitingMessages);

        awaitingMessages = awaitingMessages.filter(item => {

            if (item.message.id !== message.id) {
                return true;
            }

            item.resolve(message);
            return false;

        });

        user.set(userConst.awaitingMessages, awaitingMessages);

        console.log('data from web socket');
        console.log(message);

    }

    sendMessage(data) {
        const model = this;
        const ws = model.getWebSocket();
        ws.send(JSON.stringify(data));
    }

    connectToRoom(roomId) {

        const model = this;

        model
            .setupWebSocket()
            .then(() => model.sendMessage({
                tokenId: 'token-' + model.getTokenId() + '-token',
                className: 'Room',
                methodName: 'addConnection',
                roomId
            }));

        return model.waitMessage({id: mainConst.MESSAGE.FROM.BACK.YOU_HAS_BEEN_CONNECTED_TO_ROOM});

    }

    destroy() {

        // TODO: destroy socket
        super.destroy();

    }

}

const userModel = new UserModel();

/*
 userModel.setupWebSocket().then(() => {
 console.log('webSocket has been setup');
 });
 */

export {userModel};
