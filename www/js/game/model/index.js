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
    fixBuildingSquares: 'fixBuildingSquares',
    occupyBuildingSquares: 'occupyBuildingSquares',
    raiseSkeletonSquares: 'raiseSkeletonSquares',
    destroyBuildingSquares: 'destroyBuildingSquares',
    multiActionSquares: 'multiActionSquares',

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
                    [attr.fixBuildingSquares]: [],
                    [attr.occupyBuildingSquares]: [],
                    [attr.raiseSkeletonSquares]: [],
                    [attr.attackSquares]: [],
                    [attr.destroyBuildingSquares]: [],
                    [attr.multiActionSquares]: [],
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
        const {type} = action;

        if (type === 'move') {
            return model.doActionMove(action);
        }

        if (type === 'attack') {
            return model.doActionAttack(action);
        }

        if (type === 'add-unit') {
            model.addUnit(action.unitData);
            const newUnit = model.getUnitByXY(action.unitData.x, action.unitData.y);

            newUnit.onClick();
            return null;
        }

        if (type === 'fix-building') {
            model.fixBuilding(action.x, action.y);
            return null;
        }

        if (type === 'occupy-building') {
            model.occupyBuilding(action.x, action.y);
            return null;
        }

        if (type === 'raise-skeleton') {
            const graveX = action.x;
            const graveY = action.y;
            const {userOrder} = action;
            const grave = model.getGraveByXY(graveX, graveY);

            grave.destroy();

            model.addUnit({
                x: graveX,
                y: graveY,
                type: 'skeleton',
                userOrder
            });
            return null;
        }

        if (type === 'destroy-building') {
            return model.doActionDestroyBuilding(action);
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

        return unitAttacker
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

    doActionDestroyBuilding({attacker, building}) {
        const model = this;
        const unitAttacker = model.getUnitByXY(attacker.x, attacker.y);
        const buildingToDestroy = model.getBuildingByXY(building.x, building.y);

        unitAttacker.set('isActing', true);

        return unitAttacker
            .animateAttack(buildingToDestroy)
            .then(() => {
                unitAttacker.set('isActing', false);
                unitAttacker.set('isFinished', true);
                buildingToDestroy.gameDestroy();
            });
    }

    getUnitByXY(x, y) {
        return findLast(this.get(attr.model.units), unit => unit.get('x') === x && unit.get('y') === y);
    }

    getGraveByXY(x, y) {
        return findLast(this.get(attr.model.graves), grave => grave.get('x') === x && grave.get('y') === y);
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
            team: userData.team,
            poisonedCounter: unitData.poisonedCounter || 0
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


    fixBuilding(x, y) {
        const model = this;
        const building = model.getBuildingByXY(x, y);
        const unit = model.getUnitByXY(x, y);

        building.fix();
        unit.set('isFinished', true);
    }

    occupyBuilding(x, y) {
        const model = this;
        const building = model.getBuildingByXY(x, y);
        const unit = model.getUnitByXY(x, y);

        building.belongTo(unit.get('ownerPublicId'));
        unit.set('isFinished', true);
    }

    addMoveSquare(x, y, options = {}) {
        const model = this;
        const render = model.get(attr.render);
        const squareSize = render.get('squareSize');
        const sprite = PIXI.Sprite.fromFrame('action-move');

        sprite.x = squareSize * x;
        sprite.y = squareSize * y;
        render.addChild('ui', sprite);
        model.get(attr.moveSquares).push({sprite, x, y, type: 'move'});

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
        model.get(attr.moveSquares).push({sprite, x, y, type: 'attack'});

        sprite.interactive = true;
        sprite.buttonMode = true;
        sprite.animationSpeed = renderConfig.timing.shotAnimatedSpriteSpeed;
        sprite.play();

        const {events = {}} = options;

        Object.keys(events).forEach(eventName => sprite.on(eventName, events[eventName]));
    }

    addDestroyBuildingSquare(x, y, options = {}) {
        const model = this;
        const render = model.get(attr.render);
        const squareSize = render.get('squareSize');

        const sprite = new PIXI.extras.AnimatedSprite(
            [0, 1, 2].map(ii => PIXI.Texture.fromFrame('action-attack-' + ii))
        );

        sprite.x = squareSize * (x - 0.5);
        sprite.y = squareSize * (y - 0.5);
        render.addChild('ui', sprite);

        model.get(attr.destroyBuildingSquares).push({sprite, x, y, type: 'destroy-building'});

        sprite.interactive = true;
        sprite.buttonMode = true;
        sprite.animationSpeed = renderConfig.timing.shotAnimatedSpriteSpeed;
        sprite.play();

        const {events = {}} = options;

        Object.keys(events).forEach(eventName => sprite.on(eventName, events[eventName]));
    }

    addShopSquare(x, y, options = {}) {
        const model = this;
        const render = model.get(attr.render);
        const squareSize = render.get('squareSize');
        const sprite = PIXI.Sprite.fromFrame('open-shop');

        sprite.x = squareSize * x;
        sprite.y = squareSize * y;

        render.addChild('ui', sprite);
        model.get(attr.openShopSquares).push({sprite, x, y, type: 'open-shop'});

        sprite.interactive = true;
        sprite.buttonMode = true;

        const {events = {}} = options;

        Object.keys(events).forEach(eventName => sprite.on(eventName, events[eventName]));
    }

    addFixBuildingSquare(x, y, options = {}) {
        const model = this;
        const render = model.get(attr.render);
        const squareSize = render.get('squareSize');
        const sprite = PIXI.Sprite.fromFrame('action-fix-building');

        sprite.x = squareSize * x;
        sprite.y = squareSize * y;

        render.addChild('ui', sprite);
        model.get(attr.fixBuildingSquares).push({sprite, x, y, type: 'fix-building'});

        sprite.interactive = true;
        sprite.buttonMode = true;

        const {events = {}} = options;

        Object.keys(events).forEach(eventName => sprite.on(eventName, events[eventName]));
    }

    addOccupyBuildingSquare(x, y, options = {}) {
        const model = this;
        const render = model.get(attr.render);
        const squareSize = render.get('squareSize');
        const sprite = PIXI.Sprite.fromFrame('action-occupy-building');

        sprite.x = squareSize * x;
        sprite.y = squareSize * y;

        render.addChild('ui', sprite);
        model.get(attr.occupyBuildingSquares).push({sprite, x, y, type: 'occupy-building'});

        sprite.interactive = true;
        sprite.buttonMode = true;

        const {events = {}} = options;

        Object.keys(events).forEach(eventName => sprite.on(eventName, events[eventName]));
    }

    addRaiseSkeletonSquare(x, y, options = {}) {
        const model = this;
        const render = model.get(attr.render);
        const squareSize = render.get('squareSize');
        const sprite = PIXI.Sprite.fromFrame('skull');

        sprite.x = squareSize * x;
        sprite.y = squareSize * y;

        render.addChild('ui', sprite);
        model.get(attr.raiseSkeletonSquares).push({sprite, x, y, type: 'raise-skeleton'});

        sprite.interactive = true;
        sprite.buttonMode = true;

        const {events = {}} = options;

        Object.keys(events).forEach(eventName => sprite.on(eventName, events[eventName]));
    }

    clearAllSquares() {
        const model = this;

        model.clearMoveSquares();
        model.clearAttackSquares();
        model.clearShopSquares();
        model.clearFixBuildingSquares();
        model.clearOccupyBuildingSquares();
        model.clearRaiseSkeletonSquares();
        model.clearDestroyBuildingSquares();
        model.clearMultiActionSquares();
    }

    clearMoveSquares() {
        const model = this;
        const render = model.get(attr.render);

        const moveSquares = model.get(attr.moveSquares);

        moveSquares.forEach(({sprite}) => render.removeChild('ui', sprite));
        model.set(attr.moveSquares, []);
    }

    clearAttackSquares() {
        const model = this;
        const render = model.get(attr.render);

        const attackSquares = model.get(attr.attackSquares);

        attackSquares.forEach(({sprite}) => render.removeChild('ui', sprite));
        model.set(attr.attackSquares, []);
    }

    clearShopSquares() {
        const model = this;
        const render = model.get(attr.render);

        const openShopSquares = model.get(attr.openShopSquares);

        openShopSquares.forEach(({sprite}) => render.removeChild('ui', sprite));
        model.set(attr.openShopSquares, []);
    }

    clearFixBuildingSquares() {
        const model = this;
        const render = model.get(attr.render);

        const squares = model.get(attr.fixBuildingSquares);

        squares.forEach(({sprite}) => render.removeChild('ui', sprite));
        model.set(attr.fixBuildingSquares, []);
    }

    clearOccupyBuildingSquares() {
        const model = this;
        const render = model.get(attr.render);

        const squares = model.get(attr.occupyBuildingSquares);

        squares.forEach(({sprite}) => render.removeChild('ui', sprite));
        model.set(attr.occupyBuildingSquares, []);
    }

    clearRaiseSkeletonSquares() {
        const model = this;
        const render = model.get(attr.render);

        const squares = model.get(attr.raiseSkeletonSquares);

        squares.forEach(({sprite}) => render.removeChild('ui', sprite));
        model.set(attr.raiseSkeletonSquares, []);
    }

    clearMultiActionSquares() {
        const model = this;
        const render = model.get(attr.render);

        const squares = model.get(attr.multiActionSquares);

        squares.forEach(({sprite}) => render.removeChild('ui', sprite));
        model.set(attr.multiActionSquares, []);
    }

    clearDestroyBuildingSquares() {
        const model = this;
        const render = model.get(attr.render);

        const squares = model.get(attr.destroyBuildingSquares);

        squares.forEach(({sprite}) => render.removeChild('ui', sprite));
        model.set(attr.destroyBuildingSquares, []);
    }

    collectMultiActionSquares() {
        const model = this;
        const landscape = model.get(attr.model.landscape);
        const rawMap = landscape.getAttackFilledMap();
        const squaresMap = rawMap.map(line => line.map(() => []));
        const squares = [].concat(
            model.get(attr.moveSquares),
            model.get(attr.attackSquares),
            model.get(attr.openShopSquares),
            model.get(attr.fixBuildingSquares),
            model.get(attr.occupyBuildingSquares),
            model.get(attr.raiseSkeletonSquares),
            model.get(attr.destroyBuildingSquares),
        );

        squares.forEach(square => {
            const x = square.x;
            const y = square.y;

            squaresMap[y][x].push(square);
        });

        squaresMap.forEach(line => line.forEach(item => item.length >= 2 && model.createMultiActionSquare(item)));
    }

    createMultiActionSquare(list) {
        const model = this;
        const render = model.get(attr.render);

        // remove from ui
        list.forEach(item => render.removeChild('ui', item.sprite));

        const squareSize = render.get('squareSize');
        const sprite = PIXI.Sprite.fromFrame('well');
        const {x, y} = list[0];

        sprite.x = x * squareSize;
        sprite.y = y * squareSize;
        sprite.interactive = true;
        sprite.buttonMode = true;

        sprite.on('pointertap', () => {
            // render.removeChild('ui', sprite);
            const padding = squareSize / 6;
            const graphics = new PIXI.Graphics();

            // add close button
            const closeSprite = PIXI.Sprite.fromFrame('well');

            closeSprite.interactive = true;
            closeSprite.buttonMode = true;
            closeSprite.on('pointertap', () => {
                remove(list, {sprite: closeSprite});
                render.removeChild('ui', graphics);
            });

            list.push({sprite: closeSprite});

            const listLength = list.length;

            graphics.x = squareSize * (x - listLength / 2 + 0.5) - padding;
            graphics.y = squareSize * y - padding;

            graphics.beginFill(0xf2f2f2, 1);
            graphics.drawRect(0, 0, listLength * squareSize + padding * 2, squareSize + padding * 2);

            graphics.interactive = true;

            list.forEach((item, ii) => {
                Object.assign(item.sprite, {
                    y: padding,
                    x: ii * squareSize + padding
                });
                graphics.addChild(item.sprite);
            });

            render.addChild('ui', graphics);

            model.get(attr.multiActionSquares).push({sprite: graphics, x, y, type: 'multi-action'});
        });

        render.addChild('ui', sprite);

        model.get(attr.multiActionSquares).push({sprite, x, y, type: 'multi-action'});
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
