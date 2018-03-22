// @flow

/* global window */

import * as PIXI from 'pixi.js';
import type {MapType, LandscapeType, BuildingType} from './../../../maps/type';
import type {ServerUserType} from './../../../module/server-api';
import mapGuide from './../../../maps/map-guide';
import imageMap from './../image/image-map';
import {getUserColor} from './helper';

type InitializeConfigType = {|
    width: number,
    height: number,
    view: HTMLElement
|};

// const sprite = require('./image.png');

export default class Game {
    app: PIXI.Application;
    layer: {|
        landscape: PIXI.Container,
        buildings: PIXI.Container
    |}

    constructor() {
        const game = this; // eslint-disable-line consistent-this

        game.layer = {
            landscape: new PIXI.Container(),
            buildings: new PIXI.Container()
        };
    }

    initialize(setting: InitializeConfigType) {
        const game = this; // eslint-disable-line consistent-this

        PIXI.settings.SCALE_MODE = 1; // eslint-disable-line id-match

        const app = new PIXI.Application(setting.width, setting.height, {
            view: setting.view,
            clearBeforeRender: false,
            sharedTicker: true,
            sharedLoader: true,
            backgroundColor: 0x1099bb,
            resolution: window.devicePixelRatio || 1
        });

        game.app = app;

        // app.stage.addChild(PIXI.Sprite.fromImage(sprite));

        app.stage.addChild(game.layer.landscape);
        app.stage.addChild(game.layer.buildings);

        app.stage.position.set(100, 100);

        app.stage.scale.set(2, 2);
    }

    setCanvasSize(width: number, height: number) {
        const game = this; // eslint-disable-line consistent-this

        game.app.renderer.resize(width, height);
    }

    drawLandscape(map: MapType) {
        const game = this; // eslint-disable-line consistent-this

        const {landscape} = game.layer;

        map.landscape.forEach((list: Array<LandscapeType>, tileY: number) => {
            list.forEach((landscapeItem: LandscapeType, tileX: number) => {
                const sprite = PIXI.Sprite.fromImage(imageMap.landscape[landscapeItem]);

                sprite.position.set(tileX * mapGuide.size.square, tileY * mapGuide.size.square);

                landscape.addChild(sprite);
            });
        });
    }

    getBuildingColor(buildingData: BuildingType, userList: Array<ServerUserType>) {

    }

    drawBuildings(map: MapType, userList: Array<ServerUserType>) {
        const game = this; // eslint-disable-line consistent-this

        const {buildings} = game.layer;

        map.buildings.forEach((buildingData: BuildingType) => {
            if (['castle', 'farm'].includes(buildingData.type)) {
                const color = typeof buildingData.userId === 'string' ?
                    getUserColor(buildingData.userId, userList) :
                    'gray';
                const sprite = PIXI.Sprite.fromImage(imageMap.building[buildingData.type + '-' + color]);

                sprite.position.set(buildingData.x * mapGuide.size.square, buildingData.y * mapGuide.size.square);

                buildings.addChild(sprite);
            }

            if (['well', 'temple', 'farm-destroyed'].includes(buildingData.type)) {
                const sprite = PIXI.Sprite.fromImage(imageMap.building[buildingData.type]);

                sprite.position.set(buildingData.x * mapGuide.size.square, buildingData.y * mapGuide.size.square);

                buildings.addChild(sprite);
            }
        });
    }
}
