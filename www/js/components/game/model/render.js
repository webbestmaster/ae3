// @flow

/* global window */

import * as PIXI from 'pixi.js';
import type {MapType, LandscapeType, BuildingType} from './../../../maps/type';
import type {ServerUserType} from './../../../module/server-api';
import mapGuide from './../../../maps/map-guide';
import imageMap from './../image/image-map';
import {getUserColor} from './helper';
import type {UnitDataForAttackType} from './helper';
import type {UnitType} from '../../../maps/type';
import type {UnitActionsMapType, UnitActionType} from './unit/index';
import type {
    UnitActionAttackType,
    UnitActionMoveType,
    UnitActionFixBuildingType,
    UnitActionOccupyBuildingType,
    UnitActionRaiseSkeletonType,
    UnitActionDestroyBuildingType
} from './unit';
import Unit from './unit';
import type {SocketMessagePushStateType} from '../../../module/socket';
import {tween} from './../../../lib/tween';

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
        graves: PIXI.Container,
        units: PIXI.Container,
        actions: PIXI.Container
    |};

    constructor() {
        const render = this; // eslint-disable-line consistent-this

        render.layer = {
            landscape: new PIXI.Container(),
            buildings: new PIXI.Container(),
            graves: new PIXI.Container(),
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
        app.stage.addChild(render.layer.graves);
        app.stage.addChild(render.layer.units);
        app.stage.addChild(render.layer.actions);

        app.stage.position.set(0, 0);

        // app.stage.scale.set(0.5, 0.5);
        app.stage.scale.set(2, 2);
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

    addGrave(container: PIXI.Container) {
        const render = this; // eslint-disable-line consistent-this

        render.layer.graves.addChild(container);
    }

    drawActionsList(actionsList: UnitActionsMapType) {
        const render = this; // eslint-disable-line consistent-this

        render.cleanActionsList();

        actionsList.forEach((mapLine: Array<Array<UnitActionType>>) => {
            mapLine.forEach((actionList: Array<UnitActionType>) => {
                // check here action count, if 2 or more - make select action button
                actionList.forEach((unitAction: UnitActionType) => { // eslint-disable-line complexity
                    switch (unitAction.type) {
                        case 'move':
                            render.drawActionMove(unitAction);
                            break;

                        case 'attack':
                            render.drawActionAttack(unitAction);
                            break;

                        case 'fix-building':
                            render.drawActionFixBuilding(unitAction);
                            break;

                        case 'occupy-building':
                            render.drawActionOccupyBuilding(unitAction);
                            break;

                        case 'raise-skeleton':
                            render.drawActionRaiseSkeleton(unitAction);
                            break;

                        case 'destroy-building':
                            render.drawActionDestroyBuilding(unitAction);
                            break;

                        default:
                            console.error('unsupported unit action type', unitAction);
                    }
                });
            });
        });
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
        const {defender, container} = unitAction;

        container.position.set(defender.x * mapGuide.size.square, defender.y * mapGuide.size.square);
        container.buttonMode = true;
        container.interactive = true;
        container.addChild(PIXI.Sprite.fromImage(imageMap.other['action-attack-0']));

        render.layer.actions.addChild(unitAction.container);
    }

    drawActionFixBuilding(unitAction: UnitActionFixBuildingType) {
        const render = this; // eslint-disable-line consistent-this
        const {container} = unitAction;

        container.position.set(unitAction.x * mapGuide.size.square, unitAction.y * mapGuide.size.square);
        container.buttonMode = true;
        container.interactive = true;
        container.addChild(PIXI.Sprite.fromImage(imageMap.other['action-fix-building']));

        render.layer.actions.addChild(unitAction.container);
    }

    drawActionOccupyBuilding(unitAction: UnitActionOccupyBuildingType) {
        const render = this; // eslint-disable-line consistent-this
        const {container} = unitAction;

        container.position.set(unitAction.x * mapGuide.size.square, unitAction.y * mapGuide.size.square);
        container.buttonMode = true;
        container.interactive = true;
        container.addChild(PIXI.Sprite.fromImage(imageMap.other['action-occupy-building']));

        render.layer.actions.addChild(unitAction.container);
    }

    drawActionRaiseSkeleton(unitAction: UnitActionRaiseSkeletonType) {
        const render = this; // eslint-disable-line consistent-this
        const {grave, container} = unitAction;

        container.position.set(grave.x * mapGuide.size.square, grave.y * mapGuide.size.square);
        container.buttonMode = true;
        container.interactive = true;
        container.addChild(PIXI.Sprite.fromImage(imageMap.other.skull));

        render.layer.actions.addChild(unitAction.container);
    }

    drawActionDestroyBuilding(unitAction: UnitActionDestroyBuildingType) {
        const render = this; // eslint-disable-line consistent-this
        const {building, container} = unitAction;

        container.position.set(building.x * mapGuide.size.square, building.y * mapGuide.size.square);
        container.buttonMode = true;
        container.interactive = true;
        container.addChild(PIXI.Sprite.fromImage(imageMap.other['action-destroy-building-0']));

        render.layer.actions.addChild(unitAction.container);
    }

    cleanActionsList() {
        const render = this; // eslint-disable-line consistent-this

        render.layer.actions.removeChildren();
    }

    async drawAttack(aggressorUnit: Unit, defenderUnit: Unit): Promise<void> {
        // TODO: DO NOT set HP here - do it in handleServerPushStateAttack
        const render = this; // eslint-disable-line consistent-this
        // const state = message.states.last.state;

        /*
        if (state.type !== 'attack') {
            console.error('here is should be a ATTACK type');
            return Promise.resolve();
        }
        */

        /*
        if (!state.aggressor || !state.defender) {
            console.error('no aggressor or defender', state);
            return Promise.resolve();
        }
        */

        const attackSprite = PIXI.Sprite.fromImage(imageMap.other['action-attack-0']);

        render.layer.actions.addChild(attackSprite);

        await tween(
            {x: aggressorUnit.attr.x, y: aggressorUnit.attr.y},
            {x: defenderUnit.attr.x, y: defenderUnit.attr.y},
            1000,
            (coordinates: { x: number, y: number }) => {
                attackSprite.position.set(coordinates.x * mapGuide.size.square, coordinates.y * mapGuide.size.square);
            }
        );

        render.layer.actions.removeChild(attackSprite);

        return Promise.resolve();
    }
}
