// @flow

/* global window */

import * as PIXI from 'pixi.js';
import type {MapType, LandscapeType, BuildingType} from './../../../maps/type';
import type {ServerUserType} from './../../../module/server-api';
import mapGuide from './../../../maps/map-guide';
import imageMap from './../image/image-map';
import {getUserColor} from './helper';
import type {UnitType} from '../../../maps/type';
import Render from './render';
import type {AllRoomSettingsType} from '../../../module/server-api';
import Building from './building';
import Unit from './unit';
import type {UnitActionType} from './unit';
import * as serverApi from './../../../module/server-api';
import {user} from './../../../module/user';
import find from 'lodash/find';
import {socket} from '../../../module/socket';
import type {SocketMessageType, SocketMessagePushStateType} from '../../../module/socket';
import MainModel from './../../../lib/main-model';

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

        game.render.initialize(renderSetting);

        // draw landscape
        game.render.drawLandscape(game.settings.map);

        // add buildings
        game.settings.map.buildings.forEach((buildingData: BuildingType) => {
            game.createBuilding(buildingData);
        });

        // add units
        game.settings.map.units.forEach((unitData: UnitType) => {
            game.createUnit(unitData);
        });

        // make path maps
        game.initializePathMaps();

        game.bindEventListeners();

        // FIXME: remove extra dispatch
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

    async onMessage(message: SocketMessageType): Promise<void> { // eslint-disable-line complexity
        const game = this; // eslint-disable-line consistent-this

        switch (message.type) {
            case 'room__take-turn':

                break;

            case 'room__join-into-room':

                break;

            case 'room__leave-from-room':

                break;

            case 'room__user-disconnected':

                break;

            case 'room__push-state':
                game.handleServerPushState(message);
                break;

            default:
                console.log('---> view - game - unsupported message type: ', message);
        }
    }

    handleServerPushState(message: SocketMessagePushStateType) {
        const game = this; // eslint-disable-line consistent-this

        if (typeof message.states.last.state.type !== 'string') {
            return;
        }


        switch (message.states.last.state.type) {
            case 'move':
                // TODO: check pushed map with map after action
                console.log('---> check pushed map with map after action');
                game.handleServerPushStateMove(message);

                break;

            default:
                console.log('---> view - game - unsupported push state type: ', message);
        }
    }

    handleServerPushStateMove(message: SocketMessagePushStateType) {
        const game = this; // eslint-disable-line consistent-this
        const state = message.states.last.state;

        if (!state.unit || typeof state.unit.id !== 'string') {
            console.error('---> Wrong socket message', message);
            return;
        }

        const unitState = state.unit;
        const unitId = unitState.id;
        const unitModel = find(game.unitList, (unitModelInList: Unit): boolean => {
            return unitId === unitModelInList.attr.id;
        });

        if (!unitModel) {
            console.error('---> Can not find unitModel', message, game.unitList);
            return;
        }

        unitModel.move(unitState.x, unitState.y);

        console.log('---> unit moved!!!');
        console.log(message);
    }

    createBuilding(buildingData: BuildingType) {
        const game = this; // eslint-disable-line consistent-this
        const building = new Building({buildingData, userList: game.userList});

        game.buildingList.push(building);

        game.render.addBuilding(building.attr.container);
    }

    createUnit(unitData: UnitType) {
        const game = this; // eslint-disable-line consistent-this
        const unit = new Unit({
            unitData,
            userList: game.userList,
            event: {
                click: (clickedUnit: Unit) => {
                    game.onUnitClick(clickedUnit);
                }
            }
        });

        game.unitList.push(unit);

        game.render.addUnit(unit.attr.container);
    }

    onUnitClick(unit: Unit) {
        const game = this; // eslint-disable-line consistent-this

        const actionsList = unit.getActions({
            userList: game.userList,
            buildingList: game.buildingList,
            unitList: game.unitList,
            pathMap: game.pathMap,
            armorMap: game.armorMap,
            emptyActionMap: game.emptyActionMap
        });

        // TODO: bind on click to PIXI.Container here
        console.log(actionsList);

        game.render.drawActionsList(actionsList);

        actionsList.forEach((unitActionLine: Array<Array<UnitActionType>>) => {
            unitActionLine.forEach((unitActionList: Array<UnitActionType>) => {
                unitActionList.forEach((unitAction: UnitActionType) => {
                    unitAction.container.on('click', () => {
                        game.bindOnClickUnitAction(unitAction);
                    });
                });
            });
        });
    }

    bindOnClickUnitAction(unitAction: UnitActionType) {
        const game = this; // eslint-disable-line consistent-this

        game.render.cleanActionsList();

        const newMap: MapType = JSON.parse(JSON.stringify(game.settings.map));

        if (unitAction.type === 'move') {
            const movedUnit = find(newMap.units, {id: unitAction.id});

            if (!movedUnit) {
                console.error('--> can not find unit for action:', unitAction);
                return;
            }

            // TODO: make move path with a-star-finder and pass path into path;
            const moviePath = [[1, 2], [3, 4]];

            console.warn('---> make move path with a-star-finder and pass path into path');

            // update map movie unit
            movedUnit.x = unitAction.x;
            movedUnit.y = unitAction.y;

            serverApi
                .pushState(
                    game.roomId,
                    user.getId(),
                    {
                        type: 'room__push-state',
                        state: {
                            type: 'move',
                            path: moviePath,
                            unit: {
                                x: unitAction.x,
                                y: unitAction.y,
                                id: unitAction.id
                            },
                            map: newMap,
                            activeUserId: user.getId()
                        }
                    }
                )
                .then((response: mixed) => {
                    console.log('---> unit action pushed');
                    console.log(response);
                });

            return;
        }

        console.warn('---> unknown unitAction', unitAction);
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

    setCanvasSize(width: number, height: number) {
        const game = this; // eslint-disable-line consistent-this

        game.render.setCanvasSize(width, height);
    }

    initializePathMaps() {
        const game = this; // eslint-disable-line consistent-this

        game.initializeEmptyActionMap();

        // TODO: armorMap needed
        console.warn('---> armorMap needed');
        game.initializePathMapWalk();
        game.initializePathMapFlow();
        game.initializePathMapFly();
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

    /*
        getEmptyActionMap(): Array<Array<[]>> {
            const game = this; // eslint-disable-line consistent-this

            return JSON.parse(JSON.stringify(game.emptyActionMap));
        }
    */
}
