// @flow

/* global window */

import * as PIXI from 'pixi.js';
import type {MapType, LandscapeType, BuildingType, GraveType} from './../../../maps/type';
import type {ServerUserType} from './../../../module/server-api';
import mapGuide from './../../../maps/map-guide';
import imageMap from './../image/image-map';
import {getUserColor, getMoviePath, getEventName} from './helper';
import type {UnitType} from '../../../maps/type';
import {unitActionStateDefaultValue} from '../../../maps/type';
import Render from './render';
import type {AllRoomSettingsType} from '../../../module/server-api';
import Building from './building';
import Grave from './grave';
import Unit from './unit';
import type {
    UnitActionType,
    UnitActionsMapType,
    UnitActionMoveType,
    UnitActionAttackType,
    UnitActionFixBuildingType,
    UnitActionOccupyBuildingType,
    GameDataType, UnitActionRaiseSkeletonType
} from './unit';
import * as serverApi from './../../../module/server-api';
import {user} from './../../../module/user';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import remove from 'lodash/remove';
import {socket} from '../../../module/socket';
import type {SocketMessageType, SocketMessagePushStateType, SocketMessageTakeTurnType} from '../../../module/socket';
import MainModel from './../../../lib/main-model';
import * as unitMaster from './unit/master';
import unitGuideData, {defaultUnitData} from './unit/unit-guide';

type RenderSettingType = {|
    width: number,
    height: number,
    view: HTMLElement
|};

// const sprite = require('./image.png');

export default class Game {
    // app: PIXI.Application;
    // layer: {|
    //     landscape: PIXI.Container,
    //     buildings: PIXI.Container,
    //     units: PIXI.Container,
    // |};

    render: Render;
    settings: AllRoomSettingsType;
    userList: Array<ServerUserType>;
    buildingList: Array<Building>;
    unitList: Array<Unit>;
    graveList: Array<Grave>;
    mapState: MapType;
    emptyActionMap: Array<Array<[]>>;
    roomId: string;
    model: MainModel;
    pathMap: {
        walk: Array<Array<number>>,
        flow: Array<Array<number>>,
        fly: Array<Array<number>>
    };
    armorMap: {
        walk: Array<Array<number>>,
        flow: Array<Array<number>>,
        fly: Array<Array<number>>
    };

    constructor() {
        const game = this; // eslint-disable-line consistent-this

        game.render = new Render();
        game.buildingList = [];
        game.unitList = [];
        game.graveList = [];
        game.pathMap = {
            walk: [],
            flow: [],
            fly: []
        };
        game.armorMap = {
            walk: [],
            flow: [],
            fly: []
        };
        game.model = new MainModel();
    }

    initialize(renderSetting: RenderSettingType) {
        const game = this; // eslint-disable-line consistent-this

        game.settings.map.units = game.settings.map.units.filter((mapUnitData: UnitType): boolean => {
            return typeof mapUnitData.userId === 'string';
        });

        game.setMapState(game.settings.map);

        game.render.initialize(renderSetting);

        // draw landscape
        game.render.drawLandscape(game.settings.map);

        // add buildings
        game.settings.map.buildings.forEach((buildingData: BuildingType) => {
            game.createBuilding(buildingData);
        });

        // add units
        game.settings.map.units.forEach((unitData: UnitType) => {
            if (typeof unitData.userId !== 'string') {
                console.error('unit has no userId');
                return;
            }
            game.createUnit(unitData);
        });

        // add graves
        game.settings.map.graves.forEach((graveData: GraveType) => {
            game.createGrave(graveData);
        });

        // make path maps
        game.initializePathMaps();

        game.bindEventListeners();

        game.refreshWispAura();

        // FIXME: remove extra dispatch
        // actually fix extra horizontal scroll
        window.dispatchEvent(new window.Event('resize'));
    }

    bindEventListeners() {
        const game = this; // eslint-disable-line consistent-this
        const {model} = game;

        model.listenTo(socket.attr.model,
            'message',
            async (message: SocketMessageType): Promise<void> => {
                await game.onMessage(message);
            }
        );
    }

    async refreshUnitActionState(): Promise<void> {
        // TODO: update unit action (didMove, didAttack, etc.)
        console.warn('---> refresh unit action (didMove, didAttack, etc.)');
        const game = this; // eslint-disable-line consistent-this

        game.render.cleanActionsList();

        const newMap: MapType = JSON.parse(JSON.stringify(game.mapState));
        const {unitList} = game;
        const mapUnitList = newMap.units;
        const isUnitListLengthEqual = mapUnitList.length === unitList.length;

        if (isUnitListLengthEqual === false) {
            console.error('Unit List Length is not equal', mapUnitList, unitList);
            return;
        }

        mapUnitList.forEach((mapUnit: UnitType) => {
            const unitActionState = mapUnit.hasOwnProperty('action') && mapUnit.action ? mapUnit.action : null;

            if (unitActionState === null) {
                console.log('unit has no property \'action\'', mapUnit);
                return;
            }

            Object.keys(unitActionState).forEach((key: string) => {
                unitActionState[key] = unitActionStateDefaultValue[key];
            });
        });


        // update graves
        const {graveList} = game;
        const mapGraveList = newMap.graves;
        const isGraveListLengthEqual = mapGraveList.length === graveList.length;

        if (isGraveListLengthEqual === false) {
            console.error('Grave List Length is not equal', mapUnitList, unitList);
            return;
        }

        mapGraveList.forEach((mapGrave: GraveType) => {
            mapGrave.removeCountdown -= 1; // eslint-disable-line no-param-reassign
        });

        newMap.graves = mapGraveList.filter((mapGrave: GraveType): boolean => {
            return mapGrave.removeCountdown > 0;
        });

        serverApi
            .pushState(
                game.roomId,
                user.getId(),
                {
                    type: 'room__push-state',
                    state: {
                        type: 'refresh-unit-list',
                        map: newMap,
                        activeUserId: user.getId()
                    }
                }
            )
            .then((response: mixed) => {
                console.log('---> refresh unit list pushed');
                console.log(response);
            });
    }

    /*
        async refreshUnitPoisonCountdown(): Promise<void> {
            // TODO: update poison countdown
            // TODO: move to refreshUnitActionState !!!
            console.warn('---> update poison countdown');
        }
    */

    /*
        async refreshGraveCountdown(): Promise<void> {
            // TODO: update grave's countdown
            // TODO: move to refreshUnitActionState !!!
            console.warn('---> update grave\'s  countdown');
        }
    */

    async onMessage(message: SocketMessageType): Promise<void> { // eslint-disable-line complexity
        const game = this; // eslint-disable-line consistent-this

        switch (message.type) {
            case 'room__take-turn':
                await game.handleServerTakeTurn(message);
                break;

            case 'room__drop-turn':
                game.render.cleanActionsList();
                break;

            case 'room__join-into-room':

                break;

            case 'room__leave-from-room':

                break;

            case 'room__user-disconnected':

                break;

            case 'room__push-state':

                await game.handleServerPushState(message);
                game.checkMapState(message.states.last.state.map);
                game.setMapState(message.states.last.state.map);
                game.refreshWispAura();
                break;

            default:
                console.error('---> view - game - unsupported message type: ', message);
        }
    }

    async handleServerTakeTurn(message: SocketMessageTakeTurnType): Promise<void> {
        const game = this; // eslint-disable-line consistent-this

        game.render.cleanActionsList();

        game.unitList.forEach((unitInList: Unit) => {
            unitInList.setIsActionAvailable(true);
        });

        const activeUserId = message.states.last.activeUserId;

        if (activeUserId !== user.getId()) {
            console.log('---> take turn, but NOT for me');
            return;
        }

        console.log('---> take turn, and it\'s ME!!!');

        await game.refreshUnitActionState();
        // await game.refreshUnitPoisonCountdown();
        // await game.refreshGraveCountdown();
    }

    async handleServerPushState(message: SocketMessagePushStateType): Promise<void> { // eslint-disable-line complexity, max-statements
        const game = this; // eslint-disable-line consistent-this

        if (typeof message.states.last.state.type !== 'string') {
            return;
        }


        switch (message.states.last.state.type) {
            case 'move':
                await game.handleServerPushStateMove(message);

                break;

            case 'attack':
                await game.handleServerPushStateAttack(message);

                break;

            case 'fix-building':
                await game.handleServerPushStateFixBuilding(message);

                break;

            case 'occupy-building':
                await game.handleServerPushStateOccupyBuilding(message);

                break;

            case 'refresh-unit-list':
                await game.handleServerRefreshUnitList(message);

                break;

            default:
                console.error('---> view - game - unsupported push state type: ', message);
        }
    }

    async handleServerPushStateMove(message: SocketMessagePushStateType): Promise<void> {
        const game = this; // eslint-disable-line consistent-this
        const state = message.states.last.state;

        if (state.type !== 'move') {
            console.error('here is should be a MOVE type', message);
            return Promise.resolve();
        }

        if (!state.unit || typeof state.unit.id !== 'string') {
            console.error('---> Wrong socket message', message);
            return Promise.resolve();
        }

        const unitState = state.unit;
        const unitId = unitState.id;
        const unitModel = find(game.unitList, (unitModelInList: Unit): boolean => {
            return unitId === unitModelInList.attr.id;
        });

        if (!unitModel) {
            console.error('---> Can not find unitModel', message, game.unitList);
            return Promise.resolve();
        }

        await unitModel.move(state.to.x, state.to.y, state.path);

        game.onUnitClick(unitModel);

        return Promise.resolve();
    }

    async handleServerPushStateAttack(message: SocketMessagePushStateType): Promise<void> { // eslint-disable-line complexity, max-statements
        const game = this; // eslint-disable-line consistent-this
        const state = message.states.last.state;

        if (state.type !== 'attack') {
            console.error('here is should be a ATTACK type', message);
            return Promise.resolve();
        }

        if (!state.aggressor || !state.defender) {
            console.error('no aggressor or defender', state);
            return Promise.resolve();
        }

        const aggressorId = typeof state.aggressor.id === 'string' ? state.aggressor.id : null;
        const defenderId = typeof state.defender.id === 'string' ? state.defender.id : null;

        if (aggressorId === null || defenderId === null) {
            console.error('aggressor or defender has no Id', state);
            return Promise.resolve();
        }

        const {unitList} = game;
        const aggressorUnit = find(unitList, (unitInList: Unit): boolean => {
            return unitInList.attr.id === aggressorId;
        }) || null;

        const defenderUnit = find(unitList, (unitInList: Unit): boolean => {
            return unitInList.attr.id === defenderId;
        }) || null;

        if (aggressorUnit === null || defenderUnit === null) {
            console.error('can not find aggressor or defender', state);
            return Promise.resolve();
        }


        // aggressor attack phase
        if (state.aggressor.canAttack) {
            await game.render.drawAttack(aggressorUnit, defenderUnit);
            aggressorUnit.setDidAttack(true);
            // defender is/isn't alive
            if (state.defender.hitPoints > 0) {
                defenderUnit.setHitPoints(state.defender.hitPoints);
            } else {
                const defenderUnitGuideData = defenderUnit.getGuideData();

                if (defenderUnitGuideData.withoutGrave !== true) {
                    const currentDefenderGrave = find(game.graveList, (grave: Grave): boolean => {
                        return grave.attr.x === defenderUnit.attr.x && grave.attr.y === defenderUnit.attr.y;
                    }) || null;

                    if (currentDefenderGrave === null) {
                        game.createGrave({
                            x: defenderUnit.attr.x,
                            y: defenderUnit.attr.y,
                            removeCountdown: defaultUnitData.graveRemoveCountdown
                        });
                    } else {
                        currentDefenderGrave.setRemoveCountdown(defaultUnitData.graveRemoveCountdown);
                    }
                }

                game.removeUnit(defenderUnit);

                game.onUnitClick(aggressorUnit);

                return Promise.resolve();
            }
        } else {
            console.error('aggressor can not attack the defender', state);
            return Promise.resolve();
        }

        if (state.defender.canAttack) {
            await game.render.drawAttack(defenderUnit, aggressorUnit);
            defenderUnit.setDidAttack(true);
            // aggressor is/isn't alive
            if (state.aggressor.hitPoints > 0) {
                aggressorUnit.setHitPoints(state.aggressor.hitPoints);
            } else {
                const aggressorUnitGuideData = aggressorUnit.getGuideData();

                if (aggressorUnitGuideData.withoutGrave !== true) {
                    const currentAggressorGrave = find(game.graveList, (grave: Grave): boolean => {
                        return grave.attr.x === aggressorUnit.attr.x && grave.attr.y === aggressorUnit.attr.y;
                    }) || null;

                    if (currentAggressorGrave === null) {
                        game.createGrave({
                            x: aggressorUnit.attr.x,
                            y: aggressorUnit.attr.y,
                            removeCountdown: defaultUnitData.graveRemoveCountdown
                        });
                    } else {
                        currentAggressorGrave.setRemoveCountdown(defaultUnitData.graveRemoveCountdown);
                    }
                }

                game.removeUnit(aggressorUnit);
            }
        } else {
            console.log('defender can not attack');
        }

        if (state.aggressor.hitPoints > 0) {
            game.onUnitClick(aggressorUnit);
        }

        return Promise.resolve();
    }

    async handleServerPushStateFixBuilding(message: SocketMessagePushStateType): Promise<void> { // eslint-disable-line complexity, max-statements
        const game = this; // eslint-disable-line consistent-this
        const state = message.states.last.state;

        if (state.type !== 'fix-building') {
            console.error('here is should be a fix-building type', message);
            return Promise.resolve();
        }

        if (!state.building) {
            console.log('building is not define', message);
            return Promise.resolve();
        }

        const mapBuilding = state.building;

        const gameBuilding = find(game.buildingList, (buildingInList: Building): boolean => {
            return buildingInList.attr.x === mapBuilding.x && buildingInList.attr.y === mapBuilding.y;
        }) || null;

        if (gameBuilding === null) {
            console.error('can not find building for message', message);
            return Promise.resolve();
        }

        const gameUnit = find(game.unitList, (unitInList: Unit): boolean => {
            return unitInList.attr.x === mapBuilding.x && unitInList.attr.y === mapBuilding.y;
        }) || null;

        if (gameUnit === null) {
            console.error('can not find building for message', message);
            return Promise.resolve();
        }

        gameBuilding.setType(mapBuilding.type);
        gameUnit.setDidFixBuilding(true);

        game.onUnitClick(gameUnit);

        return Promise.resolve();
    }

    async handleServerPushStateOccupyBuilding(message: SocketMessagePushStateType): Promise<void> { // eslint-disable-line complexity, max-statements, id-length
        const game = this; // eslint-disable-line consistent-this
        const state = message.states.last.state;

        if (state.type !== 'occupy-building') {
            console.error('here is should be a occupy-building type', message);
            return Promise.resolve();
        }

        if (!state.building) {
            console.log('building is not define', message);
            return Promise.resolve();
        }

        const mapBuilding = state.building;

        const gameBuilding = find(game.buildingList, (buildingInList: Building): boolean => {
            return buildingInList.attr.x === mapBuilding.x && buildingInList.attr.y === mapBuilding.y;
        }) || null;

        if (gameBuilding === null) {
            console.error('can not find building for message', message);
            return Promise.resolve();
        }

        const gameUnit = find(game.unitList, (unitInList: Unit): boolean => {
            return unitInList.attr.x === mapBuilding.x && unitInList.attr.y === mapBuilding.y;
        }) || null;

        if (gameUnit === null) {
            console.error('can not find building for message', message);
            return Promise.resolve();
        }

        if (typeof mapBuilding.userId !== 'string') {
            console.error('userId is not defined', message);
            return Promise.resolve();
        }

        gameBuilding.setUserId(mapBuilding.userId);
        gameUnit.setDidOccupyBuilding(true);

        game.onUnitClick(gameUnit);

        return Promise.resolve();
    }

    async handleServerRefreshUnitList(message: SocketMessagePushStateType): Promise<void> {
        const game = this; // eslint-disable-line consistent-this
        const {unitList} = game;
        const socketMapState = message.states.last.state.map;

        // check unit length
        const isUnitListLengthEqual = socketMapState.units.length === unitList.length;

        if (isUnitListLengthEqual === false) {
            console.error('Unit List Length is not equal', socketMapState, unitList);
            return;
        }

        unitList.forEach(async (unit: Unit): Promise<void> => { // eslint-disable-line complexity
            const unitId = unit.attr.id;

            if (typeof unitId !== 'string' || unitId === '') {
                console.error('Unit has no id:', unitId);
                return;
            }

            const mapUnit = find(socketMapState.units, {id: unitId});

            if (!mapUnit) {
                console.error('Map unit with id:', unitId, 'is not exist on pushed map');
                return;
            }

            const isUnitEqual = isEqual(mapUnit, unit.attr);

            if (isUnitEqual === true) {
                console.log('units is equal', mapUnit, unit);
                return;
            }

            await unit.setActionState(mapUnit.action || null);
        });

        const {graveList} = game;

        // // check unit length
        // const isGraveListLengthEqual = socketMapState.graves.length === graveList.length;
        //
        // if (isGraveListLengthEqual === false) {
        //     console.error('Grave List Length is not equal', socketMapState, graveList);
        //     return;
        // }

        const graveListToRemove: Array<Grave> = [];

        graveList.forEach(async (grave: Grave): Promise<void> => { // eslint-disable-line complexity
            const mapGrave = find(socketMapState.graves, {x: grave.attr.x, y: grave.attr.y});

            if (!mapGrave) {
                if (grave.attr.removeCountdown === 1) {
                    console.log('grave ', grave, 'will remove');
                    graveListToRemove.push(grave);
                    return;
                }
                console.error('Map grave with data:', grave, 'has wrong removeCountdown');

                return;
            }

            const isGraveEqual = isEqual(mapGrave, grave.attr);

            if (isGraveEqual === true) {
                console.error('grave can NOT have equal states', mapGrave, grave);
                return;
            }

            await grave.setRemoveCountdown(mapGrave.removeCountdown);
        });

        while (graveListToRemove.length > 0) {
            game.removeGrave(graveListToRemove.pop());
        }
    }

    createBuilding(buildingData: BuildingType) {
        const game = this; // eslint-disable-line consistent-this
        const building = new Building({buildingData, userList: game.userList});

        game.buildingList.push(building);

        game.render.addBuilding(building.gameAttr.container);
    }

    createGrave(graveData: GraveType) {
        const game = this; // eslint-disable-line consistent-this
        const grave = new Grave({graveData});

        game.graveList.push(grave);

        game.render.addGrave(grave.gameAttr.container);
    }

    removeGrave(grave: Grave) {
        const game = this; // eslint-disable-line consistent-this
        const {graveList} = game;

        const lengthBeforeRemove = graveList.length;

        remove(graveList, (graveInList: Unit): boolean => {
            return graveInList === grave;
        });

        const lengthAfterRemove = graveList.length;

        // check to remove ONE grave
        if (lengthAfterRemove === lengthBeforeRemove - 1) {
            console.log('grave did removed successfully');
        } else {
            console.error('grave did NOT removed', grave, graveList);
        }

        // console.warn('Add/update grave here is needed');

        game.render.layer.graves.removeChild(grave.gameAttr.container);
        grave.destroy();
    }

    createUnit(unitData: UnitType) {
        const game = this; // eslint-disable-line consistent-this
        const unit = unitMaster.createUnit({
            unitData,
            userList: game.userList,
            event: {
                click: (clickedUnit: Unit) => {
                    game.onUnitClick(clickedUnit);
                }
            }
        });

        game.unitList.push(unit);

        game.render.addUnit(unit.gameAttr.container);
    }

    removeUnit(unit: Unit) {
        const game = this; // eslint-disable-line consistent-this
        const {unitList} = game;

        const lengthBeforeRemove = unitList.length;

        remove(unitList, (unitInList: Unit): boolean => {
            return unitInList === unit;
        });

        const lengthAfterRemove = unitList.length;

        // check to remove ONE unit
        if (lengthAfterRemove === lengthBeforeRemove - 1) {
            console.log('unit did removed successfully');
        } else {
            console.error('unit did NOT removed', unit, unitList);
        }

        // console.warn('Add/update grave here is needed');

        game.render.layer.units.removeChild(unit.gameAttr.container);
        unit.destroy();
    }

    onUnitClick(unit: Unit) {
        const game = this; // eslint-disable-line consistent-this
        const unitUserId = typeof unit.attr.userId === 'string' ? unit.attr.userId : null;

        if (unitUserId === null) {
            console.error('userId is not exists in unit', unit);
            return;
        }

        if (unitUserId !== user.getId()) {
            console.warn('this is has different userId', unit);
            return;
        }

        const actionsList = unit.getActions(game.getGameData());

        if (actionsList === null) {
            console.log('---> unit already done - set unit GRAY state');
            unit.setIsActionAvailable(false);
            return;
        }

        game.render.drawActionsList(actionsList);

        actionsList.forEach((unitActionLine: Array<Array<UnitActionType>>) => {
            unitActionLine.forEach((unitActionList: Array<UnitActionType>) => {
                unitActionList.forEach((unitAction: UnitActionType) => {
                    if (unitAction.container) {
                        unitAction.container.on(getEventName('click'), () => { // eslint-disable-line complexity
                            switch (unitAction.type) {
                                case 'move':
                                    game.bindOnClickUnitActionMove(unitAction, actionsList);
                                    break;

                                case 'attack':
                                    game.bindOnClickUnitActionAttack(unitAction);
                                    break;

                                case 'fix-building':
                                    game.bindOnClickUnitActionFixBuilding(unitAction);
                                    break;

                                case 'occupy-building':
                                    game.bindOnClickUnitActionOccupyBuilding(unitAction);
                                    break;

                                case 'raise-skeleton':
                                    game.bindOnClickUnitActionRaiseSkeleton(unitAction);
                                    break;

                                default:
                                    console.error('unknown action', unitAction);
                            }
                        });
                        return;
                    }

                    console.error('no container to add onClick', unitAction);
                });
            });
        });
    }

    bindOnClickUnitActionMove(unitAction: UnitActionMoveType, actionsList: UnitActionsMapType) {
        const game = this; // eslint-disable-line consistent-this

        game.render.cleanActionsList();

        const newMap: MapType = JSON.parse(JSON.stringify(game.mapState));

        const movedUnit = find(newMap.units, {id: unitAction.id});

        if (!movedUnit) {
            console.error('--> can not find unit for action:', unitAction);
            return;
        }

        const moviePath = getMoviePath(unitAction, actionsList);

        if (moviePath === null) {
            console.error('moviePath is not define, actually === null');
            return;
        }

        // update map movie unit
        movedUnit.x = unitAction.to.x;
        movedUnit.y = unitAction.to.y;

        movedUnit.action = movedUnit.action || {};
        movedUnit.action.didMove = true;

        serverApi
            .pushState(
                game.roomId,
                user.getId(),
                {
                    type: 'room__push-state',
                    state: {
                        type: 'move',
                        path: moviePath,
                        from: {
                            x: unitAction.from.x,
                            y: unitAction.from.y
                        },
                        to: {
                            x: unitAction.to.x,
                            y: unitAction.to.y
                        },
                        unit: {
                            id: unitAction.id
                        },
                        map: newMap,
                        activeUserId: user.getId()
                    }
                }
            )
            .then((response: mixed) => {
                console.log('---> unit action move pushed');
                console.log(response);
            });
    }

    bindOnClickUnitActionAttack(unitAction: UnitActionAttackType) { // eslint-disable-line complexity, max-statements
        const game = this; // eslint-disable-line consistent-this

        game.render.cleanActionsList();

        const newMap: MapType = JSON.parse(JSON.stringify(game.mapState));

        const aggressorUnit = find(newMap.units, {id: unitAction.aggressor.id});

        if (!aggressorUnit) {
            console.error('--> can not find aggressorUnit for action:', unitAction);
            return;
        }

        const defenderUnit = find(newMap.units, {id: unitAction.defender.id});

        if (!defenderUnit) {
            console.error('--> can not find defenderUnit for action:', unitAction);
            return;
        }

        const actionAggressorUnit = unitAction.aggressor;
        const actionDefenderUnit = unitAction.defender;

        if (actionAggressorUnit.hitPoints === 0) {
            remove(newMap.units, {id: actionAggressorUnit.id});
            const aggressorUnitGuideData = unitGuideData[actionAggressorUnit.type];

            if (aggressorUnitGuideData.withoutGrave !== true) {
                const aggressorGrave = find(newMap.graves, {
                    x: actionAggressorUnit.x,
                    y: actionAggressorUnit.y
                }) || null;

                if (aggressorGrave === null) {
                    newMap.graves.push({
                        x: actionAggressorUnit.x,
                        y: actionAggressorUnit.y,
                        removeCountdown: defaultUnitData.graveRemoveCountdown
                    });
                } else {
                    aggressorGrave.removeCountdown = defaultUnitData.graveRemoveCountdown;
                }
            }
        } else {
            const aggressorMapUnit = find(newMap.units, {id: actionAggressorUnit.id}) || null;

            if (aggressorMapUnit === null) {
                console.error('can not find', aggressorMapUnit);
            } else {
                if (actionAggressorUnit.hitPoints !== defaultUnitData.hitPoints) {
                    aggressorMapUnit.hitPoints = actionAggressorUnit.hitPoints;
                }
                if (actionAggressorUnit.canAttack) {
                    const aggressorMapUnitAction = aggressorMapUnit.action || {};

                    aggressorMapUnitAction.didAttack = true;
                    aggressorMapUnit.action = aggressorMapUnitAction;
                } else {
                    console.error('aggressorMapUnit can not attack', aggressorMapUnit);
                }
            }
        }

        if (actionDefenderUnit.hitPoints === 0) {
            remove(newMap.units, {id: actionDefenderUnit.id});
            const defenderUnitGuideData = unitGuideData[actionDefenderUnit.type];

            if (defenderUnitGuideData.withoutGrave !== true) {
                const defenderGrave = find(newMap.graves, {
                    x: actionDefenderUnit.x,
                    y: actionDefenderUnit.y
                }) || null;

                if (defenderGrave === null) {
                    newMap.graves.push({
                        x: actionDefenderUnit.x,
                        y: actionDefenderUnit.y,
                        removeCountdown: defaultUnitData.graveRemoveCountdown
                    });
                } else {
                    defenderGrave.removeCountdown = defaultUnitData.graveRemoveCountdown;
                }
            }
        } else {
            const defenderMapUnit = find(newMap.units, {id: actionDefenderUnit.id}) || null;

            if (defenderMapUnit === null) {
                console.error('can not find', defenderMapUnit);
            } else {
                if (actionDefenderUnit.hitPoints !== defaultUnitData.hitPoints) {
                    defenderMapUnit.hitPoints = actionDefenderUnit.hitPoints;
                }
                if (actionDefenderUnit.canAttack) {
                    const defenderMapUnitAction = defenderMapUnit.action || {};

                    defenderMapUnitAction.didAttack = true;
                    defenderMapUnit.action = defenderMapUnitAction;
                } else {
                    console.log('defenderMapUnit can not attack', defenderMapUnit);
                }
            }
        }

        serverApi
            .pushState(
                game.roomId,
                user.getId(),
                {
                    type: 'room__push-state',
                    state: {
                        type: 'attack',
                        aggressor: unitAction.aggressor,
                        defender: unitAction.defender,
                        map: newMap,
                        activeUserId: user.getId()
                    }
                }
            )
            .then((response: mixed) => {
                console.log('---> unit action attack pushed');
                console.log(response);
            });
    }

    bindOnClickUnitActionFixBuilding(unitAction: UnitActionFixBuildingType) { // eslint-disable-line max-statements, complexity
        const game = this; // eslint-disable-line consistent-this

        game.render.cleanActionsList();

        const newMap: MapType = JSON.parse(JSON.stringify(game.mapState));

        const building = find(newMap.buildings, {x: unitAction.x, y: unitAction.y}) || null;

        if (building === null) {
            console.error('can not find building for unit action', unitAction);
            return;
        }

        const fixerUnit = find(newMap.units, {x: unitAction.x, y: unitAction.y}) || null;

        if (fixerUnit === null) {
            console.error('can not find unit for unit action', unitAction);
            return;
        }

        fixerUnit.action = fixerUnit.action || {};
        fixerUnit.action.didFixBuilding = true;

        building.type = 'farm';

        serverApi
            .pushState(
                game.roomId,
                user.getId(),
                {
                    type: 'room__push-state',
                    state: {
                        type: 'fix-building',
                        building,
                        map: newMap,
                        activeUserId: user.getId()
                    }
                }
            )
            .then((response: mixed) => {
                console.log('---> unit action fix building pushed');
                console.log(response);
            });
    }

    bindOnClickUnitActionOccupyBuilding(unitAction: UnitActionOccupyBuildingType) { // eslint-disable-line max-statements, complexity, id-length
        const game = this; // eslint-disable-line consistent-this

        game.render.cleanActionsList();

        const newMap: MapType = JSON.parse(JSON.stringify(game.mapState));

        const building = find(newMap.buildings, {x: unitAction.x, y: unitAction.y}) || null;

        if (building === null) {
            console.error('can not find building for unit action', unitAction);
            return;
        }

        const occuperUnit = find(newMap.units, {x: unitAction.x, y: unitAction.y}) || null;

        if (occuperUnit === null) {
            console.error('can not find unit for unit action', unitAction);
            return;
        }

        occuperUnit.action = occuperUnit.action || {};
        occuperUnit.action.didOccupyBuilding = true;

        building.userId = unitAction.userId;

        serverApi
            .pushState(
                game.roomId,
                user.getId(),
                {
                    type: 'room__push-state',
                    state: {
                        type: 'occupy-building',
                        building,
                        map: newMap,
                        activeUserId: user.getId()
                    }
                }
            )
            .then((response: mixed) => {
                console.log('---> unit action occupy building pushed');
                console.log(response);
            });
    }

    bindOnClickUnitActionRaiseSkeleton(unitAction: UnitActionRaiseSkeletonType) { // eslint-disable-line max-statements, complexity, id-length
        const game = this; // eslint-disable-line consistent-this

        game.render.cleanActionsList();

        const newMap: MapType = JSON.parse(JSON.stringify(game.mapState));

        const actionGrave = unitAction.grave;
        const actionRaiser = unitAction.raiser;

        const raiserMapUnit = find(newMap.units, {x: actionRaiser.x, y: actionRaiser.y, id: actionRaiser.id}) || null;

        if (raiserMapUnit === null) {
            console.error('can not find unit for unit action', unitAction);
            return;
        }

        raiserMapUnit.action = raiserMapUnit.action || {};
        raiserMapUnit.action.didRaiseSkeleton = true;

        const graveMap = find(newMap.graves, {x: actionGrave.x, y: actionGrave.y}) || null;

        if (graveMap === null) {
            console.error('can not find grave for unit action', unitAction);
            return;
        }

        remove(newMap.graves, {x: actionGrave.x, y: actionGrave.y});

        serverApi
            .pushState(
                game.roomId,
                user.getId(),
                {
                    type: 'room__push-state',
                    state: {
                        type: 'raise-skeleton',
                        raiser: actionRaiser,
                        grave: actionGrave,
                        map: newMap,
                        activeUserId: user.getId()
                    }
                }
            )
            .then((response: mixed) => {
                console.log('---> unit action raise skeleton pushed');
                console.log(response);
            });
    }

    setSettings(settings: AllRoomSettingsType) {
        const game = this; // eslint-disable-line consistent-this

        game.settings = settings;
    }

    setUserList(userList: Array<ServerUserType>) {
        const game = this; // eslint-disable-line consistent-this

        game.userList = userList;
    }

    setRoomId(roomId: string) {
        const game = this; // eslint-disable-line consistent-this

        game.roomId = roomId;
    }

    setMapState(map: MapType) {
        const game = this; // eslint-disable-line consistent-this

        game.mapState = map;
    }

    setCanvasSize(width: number, height: number) {
        const game = this; // eslint-disable-line consistent-this

        game.render.setCanvasSize(width, height);
    }

    initializePathMaps() {
        const game = this; // eslint-disable-line consistent-this

        game.initializeEmptyActionMap();

        game.initializePathMapWalk();
        game.initializePathMapFlow();
        game.initializePathMapFly();

        game.initializeArmorMapWalk();
        game.initializeArmorMapFlow();
        game.initializeArmorMapFly();
    }

    initializePathMapWalk() {
        const game = this; // eslint-disable-line consistent-this
        const {map} = game.settings;
        const pathMap = [];

        map.landscape.forEach((line: Array<LandscapeType>, tileY: number) => {
            pathMap.push([]);
            line.forEach((landscapeItem: LandscapeType, tileX: number) => {
                const landscapeImageType = map.landscape[tileY][tileX];
                const landscapeType = landscapeImageType.replace(/-\d$/, '');
                const pathReduce = mapGuide.landscape[landscapeType].pathReduce;

                pathMap[tileY].push(pathReduce);
            });
        });
        game.pathMap.walk = pathMap;
    }

    initializePathMapFlow() {
        const game = this; // eslint-disable-line consistent-this
        const {map} = game.settings;
        const pathMap = [];

        map.landscape.forEach((line: Array<LandscapeType>, tileY: number) => {
            pathMap.push([]);
            line.forEach((landscapeItem: LandscapeType, tileX: number) => {
                const landscapeImageType = map.landscape[tileY][tileX];
                const landscapeType = landscapeImageType.replace(/-\d$/, '');
                const pathReduce = landscapeType === 'water' ?
                    1 :
                    mapGuide.landscape[landscapeType].pathReduce;

                pathMap[tileY].push(pathReduce);
            });
        });

        game.pathMap.flow = pathMap;
    }

    initializePathMapFly() {
        const game = this; // eslint-disable-line consistent-this
        const {map} = game.settings;
        const pathMap = [];

        map.landscape.forEach((line: Array<LandscapeType>, tileY: number) => {
            pathMap.push([]);
            line.forEach((landscapeItem: LandscapeType, tileX: number) => {
                pathMap[tileY].push(1);
            });
        });

        game.pathMap.fly = pathMap;
    }

    initializeArmorMapWalk() {
        const game = this; // eslint-disable-line consistent-this
        const {map} = game.settings;
        const armorMap = [];

        map.landscape.forEach((line: Array<LandscapeType>, tileY: number) => {
            armorMap.push([]);
            line.forEach((landscapeItem: LandscapeType, tileX: number) => {
                const landscapeImageType = map.landscape[tileY][tileX];
                const landscapeType = landscapeImageType.replace(/-\d$/, '');
                const placeArmor = mapGuide.landscape[landscapeType].armor;

                armorMap[tileY].push(placeArmor);
            });
        });

        game.armorMap.walk = armorMap;
    }

    initializeArmorMapFlow() {
        const game = this; // eslint-disable-line consistent-this
        const {map} = game.settings;
        const armorMap = [];

        map.landscape.forEach((line: Array<LandscapeType>, tileY: number) => {
            armorMap.push([]);
            line.forEach((landscapeItem: LandscapeType, tileX: number) => {
                const landscapeImageType = map.landscape[tileY][tileX];
                const landscapeType = landscapeImageType.replace(/-\d$/, '');
                const placeArmor = landscapeType === 'water' ?
                    mapGuide.landscape[landscapeType].flowArmor :
                    mapGuide.landscape[landscapeType].armor;

                armorMap[tileY].push(placeArmor);
            });
        });

        game.armorMap.flow = armorMap;
    }

    initializeArmorMapFly() {
        const game = this; // eslint-disable-line consistent-this
        const {map} = game.settings;
        const armorMap = [];

        map.landscape.forEach((line: Array<LandscapeType>, tileY: number) => {
            armorMap.push([]);
            line.forEach((landscapeItem: LandscapeType, tileX: number) => {
                const landscapeImageType = map.landscape[tileY][tileX];
                const landscapeType = landscapeImageType.replace(/-\d$/, '');
                const placeArmor = mapGuide.landscape[landscapeType].armor;

                armorMap[tileY].push(placeArmor);
            });
        });

        game.armorMap.fly = armorMap;
    }

    initializeEmptyActionMap() {
        const game = this; // eslint-disable-line consistent-this
        const {map} = game.settings;
        const emptyActionMap = [];

        map.landscape.forEach((line: Array<LandscapeType>, tileY: number) => {
            emptyActionMap.push([]);
            line.forEach((landscapeItem: LandscapeType, tileX: number) => {
                emptyActionMap[tileY].push([]);
            });
        });

        game.emptyActionMap = emptyActionMap;
    }

    checkMapStateUnit(socketMapState: MapType) {
        const game = this; // eslint-disable-line consistent-this
        const {unitList} = game;

        // check unit length
        const isUnitListLengthEqual = socketMapState.units.length === unitList.length;

        if (isUnitListLengthEqual === false) {
            console.error('Unit List Length is not equal', socketMapState, unitList);
            return;
        }

        const isUnitListStateEqual = unitList.every((unit: Unit): boolean => {
            const unitId = unit.attr.id;

            if (typeof unitId !== 'string' || unitId === '') {
                console.error('Unit has no id:', unitId);
                return false;
            }

            const mapUnit = find(socketMapState.units, {id: unitId});

            if (!mapUnit) {
                console.error('Map unit with id:', unitId, 'is not exist on pushed map');
                return false;
            }

            const isUnitEqual = isEqual(mapUnit, unit.attr);

            if (isUnitEqual === false) {
                console.error('units is not equal', mapUnit, unit.attr);
                return false;
            }

            return true;
        });

        if (isUnitListStateEqual === false) {
            console.error('Unit List state is not equal', socketMapState, unitList);
            return;
        }

        console.log('game map unit and push map unit is equal');
    }

    checkMapStateBuilding(socketMapState: MapType) {
        const game = this; // eslint-disable-line consistent-this
        const {buildingList} = game;

        // check building length
        const isBuildingListLengthEqual = socketMapState.buildings.length === buildingList.length;

        if (isBuildingListLengthEqual === false) {
            console.error('Building List Length is not equal', socketMapState, buildingList);
            return;
        }

        const isBuildingListStateEqual = buildingList.every((building: Building): boolean => {
            const buildingId = building.attr.id;

            if (typeof buildingId !== 'string' || buildingId === '') {
                console.error('Building has no id:', buildingId);
                return false;
            }

            const mapBuilding = find(socketMapState.buildings, {id: buildingId});

            if (!mapBuilding) {
                console.error('Map building with id:', buildingId, 'is not exist on pushed map');
                return false;
            }

            const isBuildingEqual = isEqual(mapBuilding, building.attr);

            if (isBuildingEqual === false) {
                console.error('buildings is not equal', mapBuilding, building.attr);
                return false;
            }

            return true;
        });

        if (isBuildingListStateEqual === false) {
            console.error('Building List state is not equal', socketMapState, buildingList);
            return;
        }

        console.log('game map building and push map building is equal');
    }

    checkMapStateGrave(socketMapState: MapType) {
        const game = this; // eslint-disable-line consistent-this

        const {graveList} = game;

        // check building length
        const isGraveListLengthEqual = socketMapState.graves.length === graveList.length;

        if (isGraveListLengthEqual === false) {
            console.error('Grave List Length is not equal', socketMapState, graveList);
            return;
        }

        const isGraveListStateEqual = graveList.every((grave: Grave): boolean => {
            const mapGrave = find(socketMapState.graves, {x: grave.attr.x, y: grave.attr.y});

            if (!mapGrave) {
                console.error('Map grave with data:', {x: grave.attr.x, y: grave.attr.y}, 'is not exist on pushed map');
                return false;
            }

            const isGraveEqual = isEqual(mapGrave, grave.attr);

            if (isGraveEqual === false) {
                console.error('graves is not equal', mapGrave, grave.attr);
                return false;
            }

            return true;
        });

        if (isGraveListStateEqual === false) {
            console.error('Grave List state is not equal', socketMapState, graveList);
            return;
        }

        console.log('game map grave and push map building is equal');
    }

    checkMapState(socketMapState: MapType) {
        const game = this; // eslint-disable-line consistent-this

        game.checkMapStateUnit(socketMapState);
        game.checkMapStateBuilding(socketMapState);
        game.checkMapStateGrave(socketMapState);
    }

    refreshWispAura() {
        const game = this; // eslint-disable-line consistent-this

        const gameData = game.getGameData();

        game.unitList.forEach((unit: Unit) => {
            unit.refreshWispAura(gameData);
        });
    }

    getGameData(): GameDataType {
        const game = this; // eslint-disable-line consistent-this

        const gameData: GameDataType = {
            userList: game.userList,
            buildingList: game.buildingList,
            unitList: game.unitList,
            graveList: game.graveList,
            pathMap: game.pathMap,
            armorMap: game.armorMap,
            emptyActionMap: game.emptyActionMap
        };

        return gameData;
    }
}
