const BaseModel = require('./../core/base-model');
const rooms = {};

const roomConst = {

    connectionList: 'connection_list'

};

export default class Room extends BaseModel {

    constructor(gameData) {

        super(gameData);

        const room = this;

        rooms[gameData.id] = room;

        room.set(roomConst.connectionList, []);

    }

}

function getRoomById(gameId) {
    return rooms[gameId]
}

export {getRoomById};
