/**
 * Created by dim on 23.4.17.
 */

const BaseModel = require('./../base/base-model');

const rooms = {};
const generateId = require('./../lib/generate-id');
const _ = require('lodash');

const props = {
    initialData: 'initial-data'
};

class Room extends BaseModel {

    constructor(gameData) {
        super();

        const room = this;

        room.set(props.initialData, _.pick(gameData, ['name', 'password', 'map']));

        const id = generateId();

        room.set({id});

        rooms[id] = room;
    }

    destroy() {
        const room = this;

        const roomId = room.get('id');

        Reflect.deleteProperty(rooms, roomId);

        console.log(roomId, 'destroyed');

        super.destroy();
    }

}

function getRoomById(gameId) {
    return rooms[gameId];
}

function getRoomIds() {
    return Object.keys(rooms);
}

module.exports.model = Room;
module.exports.getRoomById = getRoomById;
module.exports.getRoomIds = getRoomIds;
