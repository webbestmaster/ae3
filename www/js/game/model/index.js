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
                const render = new Render();
                const landscape = model.get('landscape');

                model.trigger(attr.currentUserIndex);
                model.set(attr.render, render);
                render.set({
                    mapWidth: landscape[0].length,
                    mapHeight: landscape.length,
                    squareSize: 24,
                    users: model.get('startUsersState')
                });
                render.drawLandscape(model.get('landscape'));
                render.drawBuildings(model.get('building'));
            });
    }
}


const gameModelAttr = attr;

export {gameModelAttr};
