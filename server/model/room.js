const BaseModel = require('./../base/base-model');
const UserData = require('./user-data').model;
const rooms = {};
const generateId = require('./../lib/generate-id');
const _ = require('lodash');
const Chat = require('./chat').model;
const sha1 = require('sha1');
const mapGuide = require('./../../www/maps/map-guide.json');
const GameModel = require('./../../www/main/game/').model;

const util = require('./../http/util.js');
const {mask, checkType, createError} = util;
const {props, createChecker} = checkType;
const {createMask} = mask;

const attr = {
    initialData: 'initial-data',
    game: 'game',
    usersData: 'users-data',
    chat: 'chat'
};

class Room extends BaseModel {

    constructor(gameData) {
        super();

        const room = this;
        const id = 'room-id-' + generateId();

        rooms[id] = room;

        room.set({
            id,
            [attr.initialData]: gameData,
            [attr.usersData]: [],
            [attr.chat]: new Chat()
        });

        room.get(attr.initialData).unitLimit = mapGuide.settings.unitLimitList[0];
        room.get(attr.initialData).defaultMoney = mapGuide.settings.defaultMoneyList[0];
    }

    destroy() {
        const room = this;
        const roomId = room.get('id');

        Reflect.deleteProperty(rooms, roomId);

        room.get(attr.chat).destroy();
        room.get(attr.usersData).forEach(userData => userData.destroy());

        if (room.get(attr.game)) {
            room.get(attr.game).destroy();
        }

        super.destroy();

        console.log(roomId, 'destroyed');
    }

    // api methods
    addUserId(req, res, pubUserId, params) {
        const room = this;
        const usersData = room.get(attr.usersData);

        if (_.find(usersData, item => item.getUserId() === pubUserId)) {
            createError({}, res, 'User already exists, pubUserId:' + pubUserId);
            return;
        }

        res.end();

        const userData = new UserData();

        userData.setUserId(pubUserId);
        usersData.push(userData);
    }

    addChatMessage(req, res, pubUserId, params) {
        const schema = {
            props: {
                text: {
                    type: props.str,
                    isRequired: true
                }
            }
        };
        const dryMask = createMask(schema);
        const check = createChecker(schema);
        const dryRequest = dryMask(params);

        if (check(dryRequest).isInvalid) {
            createError({}, res, 'Invalid message');
            return;
        }

        res.end();
        this.get(attr.chat).addMessage(pubUserId, params.text);
    }

    getState(req, res, pubUserId, params) {
        const room = this;

        res.end(JSON.stringify({
            game: room.get(attr.game) && room.get(attr.game).getState(),
            chatMessages: room.get(attr.chat).getAllMessages(),
            usersData: room.get(attr.usersData).map(userData => userData.toJSON()),
            unitLimit: room.get(attr.initialData).unitLimit,
            defaultMoney: room.get(attr.initialData).defaultMoney
        }));
    }

    updateUserData(req, res, pubUserId, params) {
        const schema = {
            props: {
                teamId: {
                    type: props.str
                },
                color: {
                    type: props.str
                }
            }
        };
        const dryMask = createMask(schema);
        const check = createChecker(schema);
        const dryRequest = dryMask(params);

        if (check(dryRequest).isInvalid) {
            createError({}, res, 'Invalid new user params');
            return;
        }

        const room = this;
        const userData = _.find(room.get(attr.usersData), item => pubUserId === item.getUserId());

        if (userData) {
            userData.set(dryRequest);
            res.end();
            return;
        }

        createError({}, res, 'Can not find userData with userId: ' + pubUserId);
    }

    setInitialGameData(req, res, pubUserId, params) {
        const schema = {
            props: {
                unitLimit: {
                    type: props.nbr
                },
                defaultMoney: {
                    type: props.nbr
                }
            }
        };
        const dryMask = createMask(schema);
        const check = createChecker(schema);
        const dryRequest = dryMask(params);

        if (check(dryRequest).isInvalid) {
            createError({}, res, 'Invalid params for setInitialGameData');
            return;
        }

        res.end();

        Object.assign(this.get(attr.initialData), dryRequest);
    }

    startGame(req, res, pubUserId, params) {
        const room = this;

        if (room.get(attr.game)) {
            createError({}, res, 'Game already started');
            return;
        }

        res.end();

        const game = new GameModel();

        room.set(attr.game, game);
        game.setInitialData(room.get(attr.initialData));
        game.addPlayers(room.get(attr.usersData));
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
