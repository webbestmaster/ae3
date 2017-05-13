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
