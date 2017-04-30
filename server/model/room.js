/**
 * Created by dim on 23.4.17.
 */

const BaseModel = require('./../base/base-model');

const rooms = {};
const generateId = require('./../lib/generate-id');
const _ = require('lodash');
const Chat = require('./chat').model;
const sha1 = require('sha1');

const props = {
    initialData: 'initial-data',
    userIds: 'user-ids',
    chat: 'chat'
};

class Room extends BaseModel {

    constructor(gameData) {
        super();

        const room = this;

        room.set(props.initialData, _.pick(gameData, ['name', 'password', 'map']));
        room.set(props.userIds, []);
        room.set(props.chat, new Chat());

        const id = 'room-id-' + generateId();

        room.set({id});

        rooms[id] = room;
    }

    addUserId(userId) {
        const userIds = this.get(props.userIds);

        return userIds.indexOf(userId) === -1 && userIds.push(userId);
    }

    addChatMessage(userId, text) {
        return this.get(props.chat).addMessage('sha1-of-user-id-' + sha1(userId), text);
    }

    getAllChatMessages() {
        return this.get(props.chat).getAllMessages();
    }

    destroy() {
        const room = this;

        const roomId = room.get('id');

        Reflect.deleteProperty(rooms, roomId);

        room.get(props.chat).destroy();

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
