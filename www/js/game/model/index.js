import BaseModel from './../../core/base-model';
import api from './../../user/api';
import {Render} from './../render';
import {Building} from './building';
import {Landscape} from './landscape';
import {createUnit} from './unit/index';
import {Grave} from './grave';
import {SelectMark} from './ui';
import {TurnMaster} from './../turn-master';
import Proc from './../../lib/proc';
import {isEqual, find, findLast, pick, remove} from 'lodash';
import {PromiseMaster} from './../../lib/promise-master';
import {store} from './../../index';
import * as gameAction from './../../game/action';
const PIXI = require('pixi.js');
const renderConfig = require('./../render/config.json');

const attr = {
    currentUserPublicId: 'currentUserPublicId',
    // startUsersState: 'startUsersState',
    render: 'render',
    turnMaster: 'turnMaster',
    promiseMaster: 'promiseMaster',
    proc: 'proc',
    // user: 'user',
    users: 'users',

    landscape: 'landscape',
    buildings: 'buildings',
    units: 'units',
    graves: 'graves',

    game: 'game',
    // turnCounter: 'turnCounter',
    shop: 'shop',

    ui: 'ui',
    moveSquares: 'moveSquares',
    attackSquares: 'attackSquares',
    openShopSquares: 'openShopSquares',

    model: {
        buildings: 'model-buildings',
        landscape: 'model-landscape',
        units: 'model-units',
        graves: 'model-graves'
    }
};

const listenKeys = [
    attr.currentUserPublicId,
    attr.users
];

export class GameModel extends BaseModel {
    start() {
        const model = this;

        console.warn('Game model is global, window.gameModel', window.gameModel = model);

        return api.post.room
            .setUserState(null, {money: model.get('defaultMoney')})
            .then(() => model.fetchData())
            .then(() => {
                const render = new Render();
                const landscape = model.get('landscape');

                model.initializeTurnMaster();

                model.startListening();

                // model.trigger(attr.currentUserPublicId);
                model.set({
                    [attr.model.landscape]: null,
                    [attr.model.buildings]: [],
                    [attr.model.units]: [],
                    [attr.model.graves]: [],
                    [attr.ui]: {
                        selectMark: null
                    },
                    [attr.moveSquares]: [],
                    [attr.openShopSquares]: [],
                    [attr.attackSquares]: [],
                    // [attr.turnCounter]: 0,
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
                model.get(attr.graves).forEach(grave => model.addGrave(grave));
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

        if (action.type === 'attack') {
            return model.doActionAttack(action);
        }

        if (action.type === 'add-unit') {
            model.addUnit(action.unitData);
            const newUnit = model.getUnitByXY(action.unitData.x, action.unitData.y);

            newUnit.onClick();
            return null;
        }

        return Promise.resolve();
    }

    doActionMove({steps}) {
        const model = this;
        const startX = steps[0][0];
        const startY = steps[0][1];

        steps.shift(); // remove zero step, cause this is the current position

        const unit = model.getUnitByXY(startX, startY);

        unit.set('isActing', true);

        return unit.animateMove(steps).then(() => {
            unit.set('isActing', false);
            unit.set('isMoved', true);
            unit.onClick();
        });
    }

    doActionAttack({attacker, defender}) {
        const model = this;
        const unitAttacker = model.getUnitByXY(attacker.x, attacker.y);
        const unitDefender = model.getUnitByXY(defender.x, defender.y);

        unitAttacker.set('isActing', true);
        unitDefender.set('isActing', true);

        unitAttacker
            .animateAttack(unitDefender)
            .then(() => {
                unitDefender.set('health', defender.health);
                if (defender.attack === null || defender.health === 0) {
                    unitDefender.set('isActing', false);
                    return null;
                }

                return unitDefender.animateAttack(unitAttacker).then(() => {
                    unitDefender.set('isActing', false);
                    unitDefender.set(defender);
                });
            })
            .then(() => {
                unitAttacker.set('isActing', false);
                unitAttacker.set('isFinished', true);
                unitAttacker.set(attacker);
            });
    }

    getUnitByXY(x, y) {
        return findLast(this.get(attr.model.units), unit => unit.get('x') === x && unit.get('y') === y);
    }

    getBuildingByXY(x, y) {
        return find(this.get(attr.model.buildings), building => building.get('x') === x && building.get('y') === y);
    }

    findWrongUnit() {
        const model = this;
        const units = model.get(attr.model.units);
        let wrongUnit = null;

        units.every(unit => {
            const x = unit.get('x');
            const y = unit.get('y');

            wrongUnit = find(units,
                item => item.get('x') === x && item.get('y') === y && item !== unit);

            return !wrongUnit;
        });

        return wrongUnit;
    }

    startListening() {
        const model = this;

        const proc = new Proc(() => model.fetchData(), 1e3);

        model.set(attr.proc, proc);
    }

    fetchData() {
        const model = this;

        return api.get.room
            .getStates({
                keys: listenKeys.join(',')
            })
            .then(({result}) => {
                const prevState = pick(model.getAllAttributes(), listenKeys);

                listenKeys.forEach(key => {
                    if (isEqual(prevState[key], result[key])) {
                        return;
                    }
                    const newKeyState = {[key]: result[key]};

                    model.set(newKeyState);
                    store.dispatch(gameAction.setState(newKeyState));
                });
            });
    }

    addBuilding(buildingData) {
        const model = this;
        const users = model.get(attr.users);
        const {type} = buildingData;

        const buildingProps = {
            type,
            color: null,
            [attr.game]: model,
            // [attr.render]: model.get(attr.render),
            x: buildingData.x,
            y: buildingData.y,
            ownerPublicId: null
        };

        if (['well', 'temple', 'farm-destroyed'].indexOf(type) !== -1) {
            console.log(['well', 'temple', 'farm-destroyed'], '---> do nothing');
        }

        if (['farm', 'castle'].indexOf(type) !== -1) {
            if (buildingData.hasOwnProperty('userOrder') && users[buildingData.userOrder]) {
                const userData = users[buildingData.userOrder];

                buildingProps.color = userData.color;
                buildingProps.ownerPublicId = userData.publicId;
            } else {
                buildingProps.color = 'gray';
            }
        }

        const building = new Building(buildingProps);

        model.get(attr.model.buildings).push(building);
    }

    addUnit(unitData) {
        const model = this;
        const users = model.get(attr.users);
        const {type} = unitData;

        const userData = users[unitData.userOrder];

        if (!userData) {
            return;
        }

        const unitProps = {
            [attr.game]: model,
            type,
            color: userData.color,
            // [attr.render]: model.get(attr.render),
            x: unitData.x,
            y: unitData.y,
            ownerPublicId: userData.publicId,
            team: userData.team
            // userOrder: unitData.userOrder
        };

        const unit = createUnit(unitProps);

        model.get(attr.model.units).push(unit);
    }

    removeUnit(unit) {
        const model = this;
        const render = model.get(attr.render);
        const units = model.get(attr.model.units);

        remove(units, unitItem => unitItem === unit);
        render.removeChild('units', unit.get('container'));
    }

    addGrave(graveData) {
        const model = this;
        const grave = new Grave({[attr.game]: model, ...graveData});

        model.get(attr.model.graves).push(grave);
    }

    removeGrave(grave) {
        const model = this;
        const render = model.get(attr.render);
        const graves = model.get(attr.model.graves);

        remove(graves, graveItem => graveItem === grave);
        render.removeChild('graves', grave.get('sprite'));
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

    addShopSquare(x, y, options = {}) {
        const model = this;
        const render = model.get(attr.render);
        const squareSize = render.get('squareSize');
        const sprite = PIXI.Sprite.fromFrame('open-shop');

        sprite.x = squareSize * x;
        sprite.y = squareSize * y;

        render.addChild('ui', sprite);
        model.get(attr.openShopSquares).push(sprite);

        sprite.interactive = true;
        sprite.buttonMode = true;

        const {events = {}} = options;

        Object.keys(events).forEach(eventName => sprite.on(eventName, events[eventName]));
    }

    addMoveSquare(x, y, options = {}) {
        const model = this;
        const render = model.get(attr.render);
        const squareSize = render.get('squareSize');
        const sprite = PIXI.Sprite.fromFrame('action-move');

        sprite.x = squareSize * x;
        sprite.y = squareSize * y;
        render.addChild('ui', sprite);
        model.get(attr.moveSquares).push(sprite);

        sprite.interactive = true;
        sprite.buttonMode = true;

        const {events = {}} = options;

        Object.keys(events).forEach(eventName => sprite.on(eventName, events[eventName]));
    }

    addAttackSquare(x, y, options = {}) {
        const model = this;
        const render = model.get(attr.render);
        const squareSize = render.get('squareSize');

        const sprite = new PIXI.extras.AnimatedSprite(
            [0, 1, 2].map(ii => PIXI.Texture.fromFrame('action-attack-' + ii))
        );

        sprite.x = squareSize * (x - 0.5);
        sprite.y = squareSize * (y - 0.5);
        render.addChild('ui', sprite);
        model.get(attr.moveSquares).push(sprite);

        sprite.interactive = true;
        sprite.buttonMode = true;
        sprite.animationSpeed = renderConfig.timing.shotAnimatedSpriteSpeed;
        sprite.play();

        const {events = {}} = options;

        Object.keys(events).forEach(eventName => sprite.on(eventName, events[eventName]));
    }

    clearAllSquares() {
        const model = this;

        model.clearMoveSquares();
        model.clearAttackSquares();
        model.clearShopSquares();
    }

    clearMoveSquares() {
        const model = this;
        const render = model.get(attr.render);

        const moveSquares = model.get(attr.moveSquares);

        moveSquares.forEach(sprite => render.removeChild('ui', sprite));
    }

    clearAttackSquares() {
        const model = this;
        const render = model.get(attr.render);

        const attackSquares = model.get(attr.attackSquares);

        attackSquares.forEach(sprite => render.removeChild('ui', sprite));
    }

    clearShopSquares() {
        const model = this;
        const render = model.get(attr.render);

        const openShopSquares = model.get(attr.openShopSquares);

        openShopSquares.forEach(sprite => render.removeChild('ui', sprite));
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
