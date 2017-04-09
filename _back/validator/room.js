/**
 * Created by dim on 9.4.17.
 */

const createRoomConst = require('./../../_front/www/js/component/create-room/const.json');
const WSchema = require('./../lib/w-schema');

const create = new WSchema({
    [createRoomConst.GAME_PROPERTY.NAME]: {type: String, required: true},
    [createRoomConst.GAME_PROPERTY.MAP]: {type: String, required: true},
    [createRoomConst.GAME_PROPERTY.PASSWORD]: {type: String, required: true},
    [createRoomConst.GAME_PROPERTY.TYPE]: {type: String, required: true}
});

module.exports.create = create;


const addConnection = new WSchema({
    roomId: {type: Number, required: true},
    staticId: {type: String, required: true}
});

module.exports.addConnection = addConnection;


const chatMessage = new WSchema({
    id: {type: String, required: true},
    staticId: {type: String, required: true},
    text: {type: String, required: true}
});

module.exports.chatMessage = chatMessage;

