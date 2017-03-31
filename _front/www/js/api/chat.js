import BaseModel from './../core/base-model';
const mainConst = require('./../../../../_main/const.json');

export default class Chat extends BaseModel {

    sendMessage(text, model) {

        const ws = model.getWebSocket();

        ws.send(JSON.stringify({
            id: mainConst.MESSAGE.FROM.FRONT.CHAT.CHAT_MESSAGE,
            from: model.getTokenId(),
            text
        }));

    }

}

const chat = new Chat();

export {chat};
