import BaseModel from './../../core/base-model';
import api from './../../user/api';
import {Render} from './../render';
import {Building} from './building';

const attr = {
    currentUserIndex: 'currentUserIndex',
    render: 'render',
    model: {
        buildings: 'model-buildings'
    }
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
                model.set({
                    [attr.render]: render,
                    [attr.model.buildings]: []
                });
                render.set({
                    mapWidth: landscape[0].length,
                    mapHeight: landscape.length
                    // startUsersState: model.get('startUsersState')
                });
                render.drawLandscape(model.get('landscape'));
                model.get('buildings').forEach(building => model.addBuilding(building));
            });
    }

    addBuilding(buildingData) {
        const model = this;
        const users = model.get('startUsersState');
        const {type} = buildingData;

        const buildingProps = {
            type,
            color: null,
            render: model.get('render'),
            x: buildingData.x,
            y: buildingData.y
        };

        if (['well', 'temple', 'farm-destroyed'].indexOf(type) !== -1) {
            console.log(['well', 'temple', 'farm-destroyed'], '---> do nothing');
        }

        if (['farm', 'castle'].indexOf(type) !== -1) {
            if (buildingData.hasOwnProperty('userOrder')) {
                const userData = users[buildingData.userOrder];

                buildingProps.color = userData ? userData.color : 'gray';
            } else {
                buildingProps.color = 'gray';
            }
        }

        const building = new Building(buildingProps);

        model.get(attr.model.buildings).push(building);
    }
}


const gameModelAttr = attr;

export {gameModelAttr};
