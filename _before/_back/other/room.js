const BaseModel = require('./../../_front/www/_main/core/base-model');
const rooms = {};
const generateId = require('./../lib/generate-id');
const each = require('lodash/each');
const mainConst = require('./../../_front/www/_main/const.json');
const roomValidator = require('./../validator/room');

const roomConst = {
    connectionList: 'room_connection_list'
};

class Room extends BaseModel {

    constructor(gameData) {

        super(gameData);

        const room = this;

        const id = generateId();

        room.set({id});

        rooms[id] = room;

        room.set(roomConst.connectionList, []);

    }

    getConnections() {

        return this.get(roomConst.connectionList);

    }

    addConnection(ws, data) {

        const room = this;
        const connections = room.getConnections();
        console.log('new connection added !!!');
        connections.push({
            ws, data: {
                staticId: data.staticId
            }
        });

        //TODO:1 send to front info about game
/*
        {
            game: {
                MAP
                GAME_NAME
                    ... etc
            }
        }
*/

        sendMessage(ws, {
            id: mainConst.MESSAGE.FROM.BACK.YOU_HAS_BEEN_CONNECTED_TO_ROOM
        });

        room.listenWs(ws);

    }

    listenWs(ws) {

        const room = this;

        ws.on('message', message => room.onWsMessage(JSON.parse(message), ws));
        ws.on('close', message => room.onWsClose(message, ws));
        ws.on('error', message => room.onWsError(message, ws));

    }

    onWsMessage(message, ws) {

        const room = this;

        switch (message.id) {

            case mainConst.MESSAGE.FROM.FRONT.CHAT.CHAT_MESSAGE:

                if (roomValidator.chatMessage.isValid(message)) {

                    room.sendMessages({
                        id: mainConst.MESSAGE.FROM.BACK.CHAT.YOU_GOT_NEW_CHAT_MESSAGE,
                        staticId: message.staticId,
                        text: message.text
                    });

                } else {

                    room.sendMessages({
                        id: mainConst.MESSAGE.FROM.BACK.CHAT.YOU_GOT_NEW_CHAT_MESSAGE,
                        staticId: message.staticId,
                        text: 'invalid message from ' + message.staticId
                    });

                }

                break;

            default:
                console.warn('can not detect message type', message);

        }

        console.log('message from ws', message);

    }

    onWsClose(message, ws) {

        const room = this;

        const connections = room.getConnections().filter(item => {

            if (item.ws === ws) {
                room.destroyConnection(item);
                return false;
            }

            return true;

        });

        room.set(roomConst.connectionList, connections);

        if (connections.length === 0) {
            room.destroy();
            return;
        }

        console.log('onClose from ws', message);

    }

    onWsError(message, ws) {

        console.log('Error from ws', message);

    }

    sendMessages(data) {

        const room = this;
        const sendString = JSON.stringify(data);

        each(room.getConnections(), item => sendMessageRaw(item.ws, sendString));

    }

    destroyConnection(item) {
        const ws = item.ws;
        ws.close();
        ws.removeAllListeners();
        item.data = null;
        item.ws = null;
    }

    destroy() {

        const room = this;

        const connection = room.getConnections();

        connection.forEach(item => room.destroyConnection);

        room.set(roomConst.connectionList, []);

        delete rooms[room.get('id')];

        console.log(room.get('id'), 'destroyed');

        super.destroy();

    }

}

function sendMessage(ws, data) {
    ws.send(JSON.stringify(data));
}

function sendMessageRaw(ws, data) {
    ws.send(data);
}


function getRoomById(gameId) {
    return rooms[gameId];
}

function getRoomIds() {
    return Object.keys(rooms);
}

//
// function createRoom(data) {
//     return new Room(data);
// }

module.exports.Room = Room;
module.exports.getRoomById = getRoomById;
module.exports.getRoomIds = getRoomIds;
// module.exports.createRoom = createRoom;