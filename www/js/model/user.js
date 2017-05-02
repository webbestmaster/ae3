/**
 * Created by dim on 30.4.17.
 */

import BaseModel from './../base/base-model';
import util from './../util/util';
import ajax from './../util/ajax';
import gprivui from '../../main/gprivui';
import gpubui from '../../main/gpubui';

// import ajax from './../util/ajax';
import httpConst from './../../main/http-const.json';
// import routerConst from './../router/const.json';
const userConst = {
    roomId: 'room-id',
    userData: 'user-data'
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

    saveUserData(params) {
        const model = this;

        return ajax.post(
            model.getRoomApiUrl('updateUserData'),
            params
        );
    }

    setId(email) {
        const model = this;
        const privUI = gprivui(email);

        model.setPublicId(privUI);
        return model.set('id', privUI);
    }

    getId() {
        return this.get('id');
    }

    setPublicId(privUI) {
        return this.set('public-id', gpubui(privUI));
    }

    getPublicId() {
        return this.get('public-id');
    }

}

export {User};

const user = new User();

console.log(util.globalify('user', user));

export default user;
