import BaseModel from './../../core/base-model';
import api from './../../user/api';
import {Render} from './../render';
import {Building} from './building';
import {Landscape} from './landscape';
import {Unit} from './unit/';
import {SelectMark} from './ui';
import {TurnMaster} from './../turn-master';
import Proc from './../../lib/proc';
import {isEqual, find} from 'lodash';
import {PromiseMaster} from './../../lib/promise-master';
const PIXI = require('pixi.js');

const attr = {
    currentUserIndex: 'currentUserIndex',
    startUsersState: 'startUsersState',
    render: 'render',
    turnMaster: 'turnMaster',
    promiseMaster: 'promiseMaster',
    proc: 'proc',
    user: 'user',

    landscape: 'landscape',
    buildings: 'buildings',
    units: 'units',

    game: 'game',

    ui: 'ui',
    moveSquares: 'moveSquares',
    model: {
        buildings: 'model-buildings',
        landscape: 'model-landscape',
        units: 'model-units'
    }
};

export class GameModel extends BaseModel {
    start() {
        const model = this;

        console.warn('Game model is global, window.gameModel', window.gameModel = model);

        return api.post.room
            .setUserState(null, {money: model.get('defaultMoney')})
            .then(() => api.get.room
                .getStates({
                    keys: ['currentUserIndex'].join(',')
                })
                .then(({result}) => model.set(result))
            )
            .then(() => {
                const render = new Render();
                const landscape = model.get('landscape');

                model.initializeTurnMaster();

                model.startListening();

                model.trigger(attr.currentUserIndex);
                model.set({
                    [attr.model.landscape]: null,
                    [attr.model.buildings]: [],
                    [attr.model.units]: [],
                    [attr.ui]: {
                        selectMark: null
                    },
                    [attr.moveSquares]: [],
                    [attr.render]: render,
                    [attr.promiseMaster]: new PromiseMaster()
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

    initializeTurnMaster() {
        const model = this;
        const turnMaster = new TurnMaster();

        model.set(attr.turnMaster, turnMaster);

        turnMaster.onNewTurns(turns => model.onNewTurns(turns));
        turnMaster.watchTurns();
    }

    onNewTurns(turns) {
        const model = this;
        const promiseMaster = model.get(attr.promiseMaster);

        turns.forEach(({list}) =>
            list.forEach(action =>
                promiseMaster.push(() => model.doAction(action))
            ));
    }

    doAction(action) {
        const model = this;

        if (action.type === 'move') {
            return model.doActionMove(action);
        }

        return Promise.resolve();
    }

    doActionMove(action) {
        const model = this;
        const {steps} = action;
        const startX = steps[0][0];
        const startY = steps[0][1];

        steps.shift(); // remove zero step, cause this is the current position

        const unit = model.getUnitByXY(startX, startY);

        return unit.animateMove(steps);
    }

    getUnitByXY(x, y) {
        return find(this.get(attr.model.units), unit => unit.get('x') === x && unit.get('y') === y);
    }

    startListening() {
        const model = this;
        let previousState = {};

        const proc = new Proc(() => {
            return api.get.room
                .getStates({
                    keys: [
                        'currentUserIndex'
                    ].join(',')
                })
                .then(({result}) => {
                    if (isEqual(previousState, result)) {
                        console.log('the same result');
                        return;
                    }

                    previousState = result;

                    model.set(result);
                });
        }, 1e3);

        model.set(attr.proc, proc);
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
            userOrder: unitData.userOrder
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

    addMoveSquare(x, y, options = {}) {
        const model = this;
        const render = model.get(attr.render);
        const squareSize = render.get('squareSize');
        const sprite = PIXI.Sprite.fromFrame('smoke-type-1-1');

        sprite.x = squareSize * x;
        sprite.y = squareSize * y;
        render.addChild('ui', sprite);
        model.get(attr.moveSquares).push(sprite);

        sprite.interactive = true;
        sprite.buttonMode = true;

        const {events = {}} = options;

        Object.keys(events).forEach(eventName => sprite.on(eventName, events[eventName]));
    }

    clearMoveSquares() {
        const model = this;
        const render = model.get(attr.render);

        // const uiLayer = render.get('ui');
        const moveSquares = model.get(attr.moveSquares);

        moveSquares.forEach(sprite => render.removeChild('ui', sprite));
    }

    getUserByPublicId(publicId) {
        return find(this.get(attr.startUsersState), user => user.publicId === publicId);
    }

    getUserByOrder(order) {
        return this.get(attr.startUsersState)[order];
    }

    getUserOrderByPublicId(publicId) {
        const model = this;
        const user = model.getUserByPublicId(publicId);
        const users = model.get(attr.startUsersState);

        return users.indexOf(user);
    }

    getUserOrder() {
        const model = this;

        return model.getUserOrderByPublicId(model.getUserPublicId());
    }

    getUserPublicId() {
        return this.get(attr.user).publicId;
    }

    destroy() {
        const model = this;

        model.get(attr.render).destroy();
        model.get(attr.turnMaster).destroy();
        model.get(attr.proc).destroy();
        super.destroy();
    }
}


const gameModelAttr = attr;

export {gameModelAttr};
