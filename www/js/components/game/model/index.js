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

        // FIXME: remove extra dispatch
        window.dispatchEvent(new window.Event('resize'));
    }

    createBuilding(buildingData: BuildingType) {
        const game = this; // eslint-disable-line consistent-this
        const building = new Building({buildingData, userList: game.userList});

        game.buildingList.push(building);

        game.render.addBuilding(building.attr.container);
    }

    createUnit(unitData: UnitType) {
        const game = this; // eslint-disable-line consistent-this
        const unit = new Unit({unitData, userList: game.userList});
        const unitContainer = unit.attr.container;

        unitContainer.interactive = true;
        unitContainer.buttonMode = true;

        unitContainer.on('click', () => {
            const actionList = unit.getActions({
                userList: game.userList,
                buildingList: game.buildingList,
                unitList: game.unitList,
                pathMap: game.pathMap,
                armorMap: game.armorMap,
                emptyActionMap: game.emptyActionMap
            });

            console.log(actionList);
            // const fullAvailablePath = unit.getFullAvailablePath();
        });

        game.unitList.push(unit);

        game.render.addUnit(unit.attr.container);
    }

    setSettings(settings: AllRoomSettingsType) {
        const game = this; // eslint-disable-line consistent-this

        game.settings = settings;
    }

    setUserList(userList: Array<ServerUserType>) {
        const game = this; // eslint-disable-line consistent-this

        game.userList = userList;
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
