import BaseModel from './../../core/base-model';
import api from './../../user/api';
import {Render} from './../render';

const attr = {
    currentUserIndex: 'currentUserIndex',
    render: 'render'
};

export class GameModel extends BaseModel {
    start() {
        const model = this;

        return api.post.room
            .setUserState(null, {money: model.get('defaultMoney')})
            .then(() => {
                model.trigger(attr.currentUserIndex);
                const render = new Render();
                model.set(attr.render, render);
            })
    }
}


const gameModelAttr = attr;

export {gameModelAttr};
