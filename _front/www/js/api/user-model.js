import BaseModel from './../core/base-model';

const userConst = {
    tokenId: 'tokenId'
};

export default class UserModel extends BaseModel {

    setTokenId(tokenId) {
        return this.set(userConst.tokenId, tokenId);
    }

    getTokenId() {
        return this.get(userConst.tokenId);
    }


}

const userModel = new UserModel();

export {userModel};
