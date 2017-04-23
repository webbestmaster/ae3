/**
 * Created by dim on 23.4.17.
 */

const BaseModel = require('./../base/base-model');

const rooms = {};
const generateId = require('./../lib/generate-id');
const each = require('lodash/each');

const props = {
    initialData: 'initial-data'
};

class Room extends BaseModel {

    constructor(gameData) {

        super();

        const room = this;

        const id = generateId();

        room.set(props.initialData, gameData);

        room.set({id});

        rooms[id] = room;

    }

    destroy() {

        const room = this;

        const roomId = room.get('id');

        rooms[roomId] = null;
        delete rooms[roomId];

        console.log(room.get('id'), 'destroyed');

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
