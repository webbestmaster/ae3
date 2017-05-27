import BaseModel from './../../core/base-model';
import api from './../../user/api';
import {Render} from './../render';
import {Building} from './building';
import {Landscape} from './landscape';
import {Unit} from './unit/';
import {SelectMark} from './ui';
const PIXI = require('pixi.js');

const attr = {
    currentUserIndex: 'currentUserIndex',
    startUsersState: 'startUsersState',
    render: 'render',

    landscape: 'landscape',
    buildings: 'buildings',
    units: 'units',

    game: 'game',

    ui: 'ui',
    movieSquares: 'movieSquares',
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
                    [attr.ui]: {
                        selectMark: null
                    },
                    [attr.movieSquares]: [],
                    [attr.render]: render
                });
                render.set({
                    mapWidth: landscape[0].length,
                    mapHeight: landscape.length
                });

                const modelLandscape = new Landscape({
                    [attr.landscape]: model.get(attr.landscape),
                    [attr.render]: render,
                    [attr.game]: model
                });

                model.set(attr.model.landscape, modelLandscape);

                model.get(attr.buildings).forEach(building => model.addBuilding(building));
                model.get(attr.units).forEach(unit => model.addUnit(unit));
                model.initializeUI();
            });
    }

    addBuilding(buildingData) {
        const model = this;
        const users = model.get(attr.startUsersState);
        const {type} = buildingData;

        const buildingProps = {
            type,
            color: null,
            [attr.render]: model.get(attr.render),
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
            game: model,
            type,
            color: userData.color,
            [attr.render]: model.get(attr.render),
            x: unitData.x,
            y: unitData.y,
            userOrder: userData.userOrder
        };

        const unit = new Unit(unitProps);

        model.get(attr.model.units).push(unit);
    }

    initializeUI() {
        const model = this;
        const selectMark = new SelectMark({
            [attr.render]: model.get(attr.render),
            x: 1,
            y: 1
        });

        const ui = model.get(attr.ui);

        ui.selectMark = selectMark;
    }

    addMovieSquare(x, y, options = {}) {
        const model = this;
        const render = model.get(attr.render);
        const squareSize = render.get('squareSize');
        const sprite = PIXI.Sprite.fromFrame('smoke-type-1-1');

        sprite.x = squareSize * x;
        sprite.y = squareSize * y;
        render.addChild('ui', sprite);
        model.get(attr.movieSquares).push(sprite);

        sprite.interactive = true;
        sprite.buttonMode = true;

        const {events = {}} = options;

        Object.keys(events).forEach(eventName => sprite.on(eventName, events[eventName]));
    }

    clearMovieSquares() {
        const model = this;
        const render = model.get(attr.render);

        // const uiLayer = render.get('ui');
        const movieSquares = model.get(attr.movieSquares);

        movieSquares.forEach(sprite => render.removeChild('ui', sprite));
    }
}


const gameModelAttr = attr;

export {gameModelAttr};
