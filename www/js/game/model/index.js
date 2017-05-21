import BaseModel from './../../core/base-model';

const attr = {
    currentUserIndex: 'currentUserIndex'
};

export class GameModel extends BaseModel {
    start() {
        const model = this;

        model.trigger(attr.currentUserIndex);
    }
}


const gameModelAttr = attr;

export {gameModelAttr};
