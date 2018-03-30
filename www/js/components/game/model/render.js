// @flow

/* global window */

import * as PIXI from 'pixi.js';
import type {MapType, LandscapeType, BuildingType} from './../../../maps/type';
import type {ServerUserType} from './../../../module/server-api';
import mapGuide from './../../../maps/map-guide';
import imageMap from './../image/image-map';
import {getUserColor} from './helper';
import type {UnitType} from '../../../maps/type';
import type {UnitActionsMapType, UnitActionType} from './unit/index';
import type {UnitActionAttackType, UnitActionMoveType} from './unit';

type InitializeConfigType = {|
    width: number,
    height: number,
    view: HTMLElement
|};

// const sprite = require('./image.png');

export default class Render {
    app: PIXI.Application;
    layer: {|
        landscape: PIXI.Container,
        buildings: PIXI.Container,
        units: PIXI.Container,
        actions: PIXI.Container
    |};

    constructor() {
        const render = this; // eslint-disable-line consistent-this

        render.layer = {
            landscape: new PIXI.Container(),
            buildings: new PIXI.Container(),
            units: new PIXI.Container(),
            actions: new PIXI.Container()
        };
    }

    initialize(setting: InitializeConfigType) {
        const render = this; // eslint-disable-line consistent-this

        PIXI.settings.SCALE_MODE = 1; // eslint-disable-line id-match

        const app = new PIXI.Application(setting.width, setting.height, {
            view: setting.view,
            clearBeforeRender: false,
            sharedTicker: true,
            sharedLoader: true,
            backgroundColor: 0x1099bb,
            resolution: window.devicePixelRatio || 1
        });

        render.app = app;

        app.stage.addChild(render.layer.landscape);
        app.stage.addChild(render.layer.buildings);
        app.stage.addChild(render.layer.units);
        app.stage.addChild(render.layer.actions);

        app.stage.position.set(0, 0);

        app.stage.scale.set(1, 1);
        // app.stage.scale.set(3, 3);
    }

    setCanvasSize(width: number, height: number) {
        const render = this; // eslint-disable-line consistent-this

        render.app.renderer.resize(width, height);
    }

    drawLandscape(map: MapType) {
        const render = this; // eslint-disable-line consistent-this

        const {landscape} = render.layer;

        map.landscape.forEach((list: Array<LandscapeType>, tileY: number) => {
            list.forEach((landscapeItem: LandscapeType, tileX: number) => {
                const sprite = PIXI.Sprite.fromImage(imageMap.landscape[landscapeItem]);

                sprite.position.set(tileX * mapGuide.size.square, tileY * mapGuide.size.square);

                landscape.addChild(sprite);
            });
        });
    }

    addBuilding(container: PIXI.Container) {
        const render = this; // eslint-disable-line consistent-this

        render.layer.buildings.addChild(container);
    }

    addUnit(container: PIXI.Container) {
        const render = this; // eslint-disable-line consistent-this

        render.layer.units.addChild(container);
    }

    drawActionsList(actionsList: UnitActionsMapType) {
        const render = this; // eslint-disable-line consistent-this

        render.cleanActionsList();

        actionsList.forEach((mapLine: Array<Array<UnitActionType>>) => {
            mapLine.forEach((actionList: Array<UnitActionType>) => {
                // check here action count, if 2 or more - make select action button
                actionList.forEach((unitAction: UnitActionType) => {
                    if (unitAction.type === 'move') {
                        render.drawAction(unitAction);
                    }

                    if (unitAction.type === 'attack') {
                        render.drawAction(unitAction);
                    }
                });
            });
        });
    }

    drawAction(unitAction: UnitActionMoveType | UnitActionAttackType) {
        const render = this; // eslint-disable-line consistent-this

        if (unitAction.type === 'move') {
            render.drawActionMove(unitAction);
            return;
        }

        if (unitAction.type === 'attack') {
            render.drawActionAttack(unitAction);
            return;
        }

        console.warn('---> unknown unit action', unitAction);
    }

    drawActionMove(unitAction: UnitActionMoveType) {
        const render = this; // eslint-disable-line consistent-this
        const {to, container} = unitAction;

        container.position.set(to.x * mapGuide.size.square, to.y * mapGuide.size.square);
        container.buttonMode = true;
        container.interactive = true;
        container.addChild(PIXI.Sprite.fromImage(imageMap.other['action-move']));

        render.layer.actions.addChild(unitAction.container);
    }

    drawActionAttack(unitAction: UnitActionAttackType) {
        const render = this; // eslint-disable-line consistent-this

        console.error('NO draw unit attack');

        /*
        const {to, container} = unitAction;

        container.position.set(to.x * mapGuide.size.square, to.y * mapGuide.size.square);
        container.buttonMode = true;
        container.interactive = true;
        container.addChild(PIXI.Sprite.fromImage(imageMap.other['action-attack-0']));

        render.layer.actions.addChild(unitAction.container);
*/
    }

    cleanActionsList() {
        const render = this; // eslint-disable-line consistent-this

        render.layer.actions.removeChildren();
    }

    /*
        getBuildingColor(buildingData: BuildingType, userList: Array<ServerUserType>) {

        }

        drawBuildings(map: MapType, userList: Array<ServerUserType>) {
            const game = this; // eslint-disable-line consistent-this

            const {buildings} = game.layer;

            map.buildings.forEach((buildingData: BuildingType) => {
                if (['castle', 'farm'].includes(buildingData.type)) {
                    let color = 'gray';

                    if (typeof buildingData.userId === 'string') {
                        const userColor = getUserColor(buildingData.userId, userList);

                        if (typeof userColor === 'string') {
                            color = userColor;
                        }
                    }

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

        drawUnits(map: MapType, userList: Array<ServerUserType>) {
            const game = this; // eslint-disable-line consistent-this

            const {units} = game.layer;

            map.units.forEach((unitData: UnitType) => {
                let color = 'gray';

                if (typeof unitData.userId === 'string') {
                    const userColor = getUserColor(unitData.userId, userList);

                    if (typeof userColor === 'string') {
                        color = userColor;
                    }
                }

                const sprite = PIXI.Sprite.fromImage(imageMap.unit[unitData.type + '-' + color + '-0']);

                sprite.position.set(unitData.x * mapGuide.size.square, unitData.y * mapGuide.size.square);

                units.addChild(sprite);
            });
        }
    */
}
