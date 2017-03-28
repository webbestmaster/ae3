const BaseModel = require('./../core/base-model');
const rooms = {};
const generateId = require('./../lib/internal/generate-id');
const each = require('lodash/each');

const roomConst = {

    connectionList: 'room_connection_list'

};

// TODO: add room destroy
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

    pushConnection(ws) {

        const room = this;
        const connections = room.getConnections();
        console.log('new connection added !!!');
        connections.push(ws);
        room.sendMessages({text: 'new connection added !!!'});

    }

    sendMessage(ws, data) {
        ws.send(JSON.stringify(data));
    }

    sendMessageRaw(ws, data) {
        ws.send(data);
    }

    sendMessages(data) {

        const room = this;
        const sendString = JSON.stringify(data);

        each(room.getConnections(), ws => room.sendMessageRaw(ws, sendString));

    }

}

function getRoomById(gameId) {
    return rooms[gameId]
}
//
// function createRoom(data) {
//     return new Room(data);
// }

module.exports.Room = Room;
module.exports.getRoomById = getRoomById;
// module.exports.createRoom = createRoom;
