import BaseModel from './../core/base-model';
import api from './';

const userConst = {
    tokenId: 'tokenId',
    webSocket: 'webSocket'
};

export default class UserModel extends BaseModel {

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
                    newWebSocket.onopen = resolve;
                    newWebSocket.onmessage = input => model.onWebSocketMessage(input);
                })
            );

    }

    onWebSocketMessage(input) {

        console.log('data from web socket');
        console.log(input);

    }

    sendMessage(data) {
        const model = this;
        const ws = model.getWebSocket();
        ws.send(JSON.stringify(data));
    }

    connectToRoom(roomId) {

        this.sendMessage({
            className: 'Room',
            methodName: 'addConnection',
            roomId
        });

    }

    destroy() {

        // TODO: destroy socket
        super.destroy();

    }

}

const userModel = new UserModel();

userModel.setupWebSocket().then(() => {
    console.log('webSocket has been setup');
});

export {userModel};
