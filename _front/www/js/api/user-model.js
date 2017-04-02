import BaseModel from './../core/base-model';
import api from './';
const mainConst = require('./../../../../_main/const.json');

const userConst = {
    tokenId: 'const_tokenId',
    staticId: 'const_staticId',
    // roomId: 'roomId', //TODO: use it for reconnect
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
     setRoomId(roomId) {
     return this.set(userConst.roomId, roomId);
     }

     getRoomId() {
     return this.get(userConst.roomId);
     }
     */

     setStaticId(staticId) {
        return this.set(userConst.staticId, staticId);
     }

     getStaticId() {
        return this.get(userConst.staticId);
     }

/*
    setTokenId(tokenId) {
        return this.set(userConst.tokenId, tokenId);
    }

    getTokenId() {
        return this.get(userConst.tokenId);
    }
 */

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
                    newWebSocket.addEventListener('open', function one() {
                        this.removeEventListener('open', one, false);
                        resolve();
                    }, false);
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

        ws.addEventListener('close', wsOnClose, false);
        ws.addEventListener('error', wsOnError, false);
        ws.addEventListener('message', wsOnMessage, false);

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

        user.lookUpOtherForMessages(message);

        console.log('data from web socket');
        console.log(message);

    }

    rejectWaitingMessage(message) {

        const user = this;
        let awaitingMessages = user.get(userConst.awaitingMessages);

        awaitingMessages = awaitingMessages.filter(item => {

            if (item.message.id !== message.id) {
                return true;
            }

            item.reject(message);
            return false;

        });

        user.set(userConst.awaitingMessages, awaitingMessages);

    }

    lookUpOtherForMessages(message) {

        const model = this;

        switch (message.id) {

            case mainConst.MESSAGE.FROM.BACK.ROOM_IS_NOT_EXISTS:
                alert('room is not exist');

                model.rejectWaitingMessage({id: mainConst.MESSAGE.FROM.BACK.YOU_HAS_BEEN_CONNECTED_TO_ROOM});

                break;

            case mainConst.MESSAGE.FROM.BACK.YOU_HAS_BEEN_CONNECTED_TO_ROOM:
            case mainConst.MESSAGE.FROM.BACK.CHAT.YOU_GOT_NEW_CHAT_MESSAGE:

                console.log(message);

                break;

            default:

                console.warn('message with id', message.id, 'not found');

        }

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
                // tokenId: 'token-' + model.getTokenId() + '-token',
                staticId: model.getStaticId(),
                className: 'Room',
                methodName: 'addConnection',
                roomId
            }));

        return model
            .waitMessage({id: mainConst.MESSAGE.FROM.BACK.YOU_HAS_BEEN_CONNECTED_TO_ROOM});
        // .then(waitMessage => model.setRoomId(roomId));
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

function wsOnClose(e) {
    console.warn('ws is closed');
    console.log(e);
}

function wsOnError(e) {
    console.error('ws is error');
    console.log(e);
}

function wsOnMessage(message) {
    userModel.onWebSocketMessage(JSON.parse(message.data));
}

