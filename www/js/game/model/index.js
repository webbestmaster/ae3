import BaseModel from './../../core/base-model';
import api from './../../user/api';
import {Render} from './../render';
import {Building} from './building';
import {Landscape} from './landscape';
import {Unit} from './unit/';

const attr = {
    currentUserIndex: 'currentUserIndex',
    startUsersState: 'startUsersState',
    render: 'render',

    landscape: 'landscape',
    buildings: 'buildings',
    units: 'units',

    model: {
        buildings: 'model-buildings',
        landscape: 'model-landscape',
        units: 'model-units'
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
                    [attr.model.landscape]: null,
                    [attr.model.buildings]: [],
                    [attr.model.units]: [],
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
                model.get(attr.units).forEach(unit => model.addUnit(unit));
            });
    }

    addBuilding(buildingData) {
        const model = this;
        const users = model.get(attr.startUsersState);
        const {type} = buildingData;

        const buildingProps = {
            type,
            color: null,
            render: model.get(attr.render),
            x: buildingData.x,
            y: buildingData.y,
            userOrder: null
        };

        if (['well', 'temple', 'farm-destroyed'].indexOf(type) !== -1) {
            console.log(['well', 'temple', 'farm-destroyed'], '---> do nothing');
        }

        if (['farm', 'castle'].indexOf(type) !== -1) {
            if (buildingData.hasOwnProperty('userOrder') && users[buildingData.userOrder]) {
                const userData = users[buildingData.userOrder];

                buildingProps.color = userData.color;
                buildingProps.userOrder = userData.userOrder;
            } else {
                buildingProps.color = 'gray';
            }
        }

        const building = new Building(buildingProps);

        model.get(attr.model.buildings).push(building);
    }

    addUnit(unitData) {
        const model = this;
        const users = model.get(attr.startUsersState);
        const {type} = unitData;

        const userData = users[unitData.userOrder];

        if (!userData) {
            return;
        }

        const unitProps = {
            type,
            color: userData.color,
            render: model.get(attr.render),
            x: unitData.x,
            y: unitData.y,
            userOrder: userData.userOrder
        };

        const unit = new Unit(unitProps);

        model.get(attr.model.units).push(unit);
    }
}


const gameModelAttr = attr;

export {gameModelAttr};
