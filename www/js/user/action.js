const sha1 = require('sha1');
const userConst = require('./const.json');

export function setId(id) {
    return {
        type: userConst.type.setId,
        payload: {
            id: 'user-id-' + sha1(id)
        }
    };
}

export function setRoomId(roomId) {
    return {
        type: userConst.type.setRoomId,
        payload: {
            roomId: 'user-id-' + sha1(roomId)
        }
    };
}
