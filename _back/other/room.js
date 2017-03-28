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

    pushConnection(ws, data) {

        const room = this;
        const connections = room.getConnections();
        console.log('new connection added !!!');
        connections.push({ws, data});
        room.sendMessages({text: 'new connection added wwwwww!!!'});

/*
        ws.onmessage = function () {
            // listen a ws
            // use data (see above) to identify ws
        };
*/

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

        each(room.getConnections(), item => room.sendMessageRaw(item.ws, sendString));

    }

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
