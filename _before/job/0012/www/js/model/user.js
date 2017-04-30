import BaseModel from './../core/base-model';

const userConst = {
    sessionId: '_sessionId',
    phoneNumber: '_phoneNumber',
    name: '_name'
};

class UserModel extends BaseModel {

    setSessionId(sessionId) {
        if (!sessionId) {
            throw new Error('NO session ID!');
        }

        return this.set(userConst.sessionId, sessionId);
    }

    getSessionId() {
        return this.get(userConst.sessionId);
    }

    setName(name) {
        return this.set(userConst.name, name);
    }

    getName() {
        return this.get(userConst.name);
    }

    setPhoneNumber(phoneNumber) {
        return this.set(userConst.phoneNumber, phoneNumber);
    }

    getPhoneNumber() {
        return this.get(userConst.phoneNumber);
    }

}

const userModel = new UserModel();

export default userModel;
