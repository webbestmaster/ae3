import BaseModel from './../core/base-model';

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

    setupWebSocket(webSocket) {

        const model = this;

        model.setWebSocket(webSocket);

        return new Promise((resolve, reject) => {
            webSocket.onopen = resolve;
            webSocket.onmessage = input => model.onWebSocketMessage(input);
        });

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



    }

}

const userModel = new UserModel();

export {userModel};
