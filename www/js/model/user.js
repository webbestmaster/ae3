/**
 * Created by dim on 30.4.17.
 */

import BaseModel from './../base/base-model';
import sha1 from 'sha1';
import util from './../util/util';
import ajax from './../util/ajax';


// import ajax from './../util/ajax';
import httpConst from './../../main/http-const.json';
// import routerConst from './../router/const.json';

const userConst = {
    roomId: 'room-id'
};

class User extends BaseModel {

    constructor() {
        super();
        this.const = userConst;
    }

    getRoomApiUrl(methodName, params = '-') {
        const model = this;

        return httpConst.route.roomApi
            .replace(':userId', model.getId())
            .replace(':roomId', model.get(userConst.roomId))
            .replace(':methodName', methodName)
            .replace(':params', params);
    }

    enterRoom() {
        const model = this;

        return ajax.get(model.getRoomApiUrl('addUserId'));
    }

    sendChatMessage(text) {
        const model = this;

        return ajax.post(
            model.getRoomApiUrl('addChatMessage'),
            {text}
        );
    }

    getRoomState() {
        return ajax
            .get(this.getRoomApiUrl('getState'))
            .then(stateStr => JSON.parse(stateStr));
    }

    setId(email) {
        return this.set('id', 'user-id-' + sha1(email));
    }

    getId() {
        return this.get('id');
    }

}

export {User};

const user = new User();

console.log(util.globalify('user', user));

export default user;
