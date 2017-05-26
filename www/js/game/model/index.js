import BaseModel from './../../core/base-model';
import api from './../../user/api';
import {Render} from './../render';
import {Building} from './building';
import {Landscape} from './landscape';

const attr = {
    currentUserIndex: 'currentUserIndex',
    render: 'render',
    landscape: 'landscape',
    buildings: 'buildings',
    model: {
        buildings: 'model-buildings',
        landscape: 'landscape'
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
                    [attr.model.buildings]: [],
                    [attr.render]: render
                });
                render.set({
                    mapWidth: landscape[0].length,
                    mapHeight: landscape.length
                });

                const modelLandscape = new Landscape({
                    [attr.landscape]: model.get(attr.landscape),
                    [attr.render]: render
                });

                model.set(attr.model.landscape, modelLandscape);

                model.get(attr.buildings).forEach(building => model.addBuilding(building));
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
