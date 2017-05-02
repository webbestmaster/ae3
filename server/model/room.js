/**
 * Created by dim on 23.4.17.
 */

const BaseModel = require('./../base/base-model');
const UserData = require('./user-data').model;

const rooms = {};
const generateId = require('./../lib/generate-id');
const _ = require('lodash');
const Chat = require('./chat').model;
const sha1 = require('sha1');
const createError = require('./../http/api').createError;

const props = {
    initialData: 'initial-data',
    userIds: 'user-ids',
    usersData: 'users-data',
    chat: 'chat'
};

class Room extends BaseModel {

    constructor(gameData) {
        super();

        const room = this;

        room.set({
            [props.initialData]: _.pick(gameData, ['name', 'password', 'map']),
            [props.userIds]: [],
            [props.usersData]: [],
            [props.chat]: new Chat()
        });

        const id = 'room-id-' + generateId();

        room.set({id});

        rooms[id] = room;
    }

    destroy() {
        const room = this;

        const roomId = room.get('id');

        Reflect.deleteProperty(rooms, roomId);

        room.get(props.chat).destroy();
        room.get(props.usersData).forEach(userData => userData.destroy());

        console.log(roomId, 'destroyed');

        super.destroy();
    }

    // api methods
    addChatMessage(req, res, pubUserId, params) {
        res.end();
        this.get(props.chat).addMessage(pubUserId, params.text);
    }

    getState(req, res, pubUserId, params) {
        const room = this;

        res.end(JSON.stringify({
            chatMessages: room.get(props.chat).getAllMessages(),
            usersData: room.get(props.usersData).map(userData => userData.toJSON())
        }));
    }

    addUserId(req, res, pubUserId, params) {
        res.end();

        const room = this;
        const userIds = room.get(props.userIds);

        if (userIds.indexOf(pubUserId) !== -1) {
            return;
        }

        userIds.push(pubUserId);

        const userData = new UserData();

        userData.setUserId(pubUserId);
        room.get(props.usersData).push(userData);
    }

    updateUserData(req, res, pubUserId, params) {
        res.end();

        const room = this;
        const userData = _.find(room.get(props.usersData), item => pubUserId === item.getUserId());

        if (userData) {
            userData.set(_.pick(params, ['teamId', 'color']));
            res.end();
            return;
        }

        createError({}, res, 'Can not find userData with userId ' + pubUserId);
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
