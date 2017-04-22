import viewConst from './const';

const {CHAT_ADD_MESSAGE} = viewConst;

export function addMessage(webSocketMessage) {

    const messageData = JSON.parse(webSocketMessage.data);

    return {
        type: CHAT_ADD_MESSAGE,
        messageData
    };

}
