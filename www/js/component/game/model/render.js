// @flow

/* global window, requestAnimationFrame */

/* eslint consistent-this: ["error", "render"] */

import * as PIXI from 'pixi.js';
import type {LandscapeType, MapType} from '../../../maps/type';
import {mapGuide} from '../../../maps/map-guide';
import {imageMap} from '../image/image-map';
import {
    Unit,
    type UnitActionAttackType,
    type UnitActionDestroyBuildingType,
    type UnitActionFixBuildingType,
    type UnitActionMoveType,
    type UnitActionOccupyBuildingType,
    type UnitActionOpenStoreType,
    type UnitActionRaiseSkeletonType,
    type UnitActionsMapType,
    type UnitActionType,
} from './unit/unit';
import {defaultUnitData} from './unit/unit-guide';
import {Building} from './building/building';
import {tween} from '../../../lib/tween/tween';
import Viewport from 'pixi-viewport';
import {
    bindClick,
    getReducedLandscapeType,
    getRenderLandscapeType,
    getSquareReducedLandscapeType,
    isNeedDrawAngleLine,
    isNeedDrawBigAngle,
    isNeedDrawSmallAngle,
} from './helper';

import borderImage1 from '../i/border/1.png';
import borderImage2 from '../i/border/2.png';
import borderImage3 from '../i/border/3.png';
import borderImage4 from '../i/border/4.png';
import borderImage6 from '../i/border/6.png';
import borderImage7 from '../i/border/7.png';
import borderImage8 from '../i/border/8.png';
import borderImage9 from '../i/border/9.png';

type InitializeConfigType = {|
    width: number,
    height: number,
    view: HTMLElement,
    map: MapType,
|};

const squareSize = mapGuide.size.square;

const stagePadding = {
    top: squareSize,
    right: squareSize,
    left: squareSize,
    bottom: squareSize,
};

// const sprite = require('./image.png');

export class Render {
    app: PIXI.Application;
    layer: {|
        landscape: PIXI.Container,
        buildings: PIXI.Container,
        graves: PIXI.Container,
        units: PIXI.Container,
        actions: PIXI.Container,
    |};

    map: MapType;
    viewport: Viewport | null;
    mainContainer: PIXI.Container;

    constructor() {
        const render = this;

        render.layer = {
            landscape: new PIXI.Container(),
            buildings: new PIXI.Container(),
            graves: new PIXI.Container(),
            units: new PIXI.Container(),
            actions: new PIXI.Container(),
        };
    }

    // eslint-disable-next-line max-statements
    initialize(setting: InitializeConfigType) {
        const render = this;

        render.map = JSON.parse(JSON.stringify(setting.map));

        const worldSize = render.getWorldSize();

        const app = new PIXI.Application(setting.width, setting.height, {
            view: setting.view,
            clearBeforeRender: true,
            sharedTicker: true,
            sharedLoader: true,
            transparent: true,
            roundPixels: true,
            // backgroundColor: 0x1099bb,
            resolution: window.devicePixelRatio || 1,
        });

        render.app = app;

        const viewport = new Viewport({
            screenWidth: setting.width,
            screenHeight: setting.height,
            worldWidth: worldSize.width,
            worldHeight: worldSize.height,
        });

        render.viewport = viewport;

        // app.stage.position.set(stagePadding.top, stagePadding.left);

        app.stage.addChild(viewport);

        render.startViewportPluginList();

        const mainContainer = new PIXI.Container();

        render.mainContainer = mainContainer;

        render.drawBorder(worldSize.width, worldSize.height);

        mainContainer.position.set(stagePadding.top, stagePadding.left);
        mainContainer.addChild(render.layer.landscape);
        mainContainer.addChild(render.layer.buildings);
        mainContainer.addChild(render.layer.graves);
        mainContainer.addChild(render.layer.units);
        mainContainer.addChild(render.layer.actions);

        viewport.addChild(mainContainer);

        render.moveToCenter();

        render.fixBugWithExtraTouch(setting.view);
    }

    fixBugWithExtraTouch(wrapper: HTMLElement) {
        const render = this;

        wrapper.addEventListener('touchstart', async (evt: TouchEvent) => {
            const {touches} = evt;

            if (touches.length > 1) {
                await render.cleanActionsList();
            }
        });

        wrapper.addEventListener('touchend', async (evt: TouchEvent) => {
            const {touches} = evt;

            if (touches.length !== 0) {
                await render.cleanActionsList();
            }
        });

        wrapper.addEventListener('touchcancel', async () => {
            await render.cleanActionsList();
        });
    }

    moveCenterTo(x: number, y: number) {
        const render = this;
        const {viewport} = render;

        if (!viewport) {
            console.error('viewport is not define, moveCenterTo', render);
            return;
        }

        viewport.moveCenter(x, y);
    }

    moveToCenter() {
        const render = this;

        const worldSize = render.getWorldSize();

        render.moveCenterTo(worldSize.width / 2, worldSize.height / 2);
    }

    // x, y - game world coordinates
    async moveWorldTo(x: number, y: number) {
        const render = this;
        const {square} = mapGuide.size;
        const halfSquare = square / 2;

        render.moveCenterTo(x * square + halfSquare + stagePadding.left, y * square + halfSquare + stagePadding.top);
    }

    // x, y - game world coordinates
    moveWorldToInstantly(x: number, y: number) {
        console.log('moveWorldToInstantly is needless and disabled');

        /*
        const render = this;
        const {square} = mapGuide.size;
        const halfSquare = square / 2;

        render.moveCenterTo(x * square + halfSquare + stagePadding.left, y * square + halfSquare + stagePadding.top);
        */
    }

    getWorldSize(): {width: number, height: number} {
        const render = this;
        const {map} = render;

        if (!map || !map.landscape || !map.landscape[0]) {
            return {
                width: 0,
                height: 0,
            };
        }

        return {
            width: map.landscape[0].length * mapGuide.size.square + stagePadding.top + stagePadding.bottom,
            height: map.landscape.length * mapGuide.size.square + stagePadding.left + stagePadding.right,
        };
    }

    setCanvasSize(width: number, height: number) {
        const render = this;
        const {viewport} = render;

        if (!viewport) {
            console.error('viewport is not define, setCanvasSize', render);
            return;
        }

        const worldSize = render.getWorldSize();

        if (!render.app.renderer) {
            console.log('render is not define, probably pixi.app is destroyed');
            return;
        }

        render.app.renderer.resize(width, height);
        viewport.resize(width, height, worldSize.width, worldSize.height);

        const {square} = mapGuide.size;
        const worldSizeQ = square * 12;
        const worldSizeMaxScaleQ = 4;

        viewport.clampZoom({
            minWidth: worldSize.width / worldSizeMaxScaleQ * (width / worldSizeQ),
            minHeight: worldSize.height / worldSizeMaxScaleQ * (height / worldSizeQ),
            maxWidth: worldSize.width * (width / worldSizeQ),
            maxHeight: worldSize.height * (height / worldSizeQ),
        });
    }

    drawLandscape(map: MapType, onClick: (x: number, y: number) => Promise<void>) {
        const render = this;

        const {landscape} = render.layer;

        map.landscape.forEach((list: Array<LandscapeType>, tileY: number) => {
            list.forEach((landscapeItem: LandscapeType, tileX: number) => {
                const container = new PIXI.Container();
                const sprite = PIXI.Sprite.fromImage(imageMap.landscape[getRenderLandscapeType(map, tileX, tileY)]);

                container.addChild(sprite);

                container.position.set(tileX * mapGuide.size.square, tileY * mapGuide.size.square);

                landscape.addChild(container);

                container.buttonMode = true;
                container.interactive = true;

                bindClick(container, async () => {
                    await onClick(tileX, tileY);
                });

                render.addAngles(container, map, tileX, tileY);
            });
        });
    }

    // eslint-disable-next-line complexity, max-statements
    addAngles(container: PIXI.Container, map: MapType, tileX: number, tileY: number) {
        const tileType = getReducedLandscapeType(map, tileX, tileY);

        if (tileType !== 'water' && tileType !== 'road') {
            console.log('draw angles for water and road only');
            return;
        }

        const squareTypeList = getSquareReducedLandscapeType(map, tileX, tileY);

        // draw | and --
        // --> draw | and -- for up
        if (isNeedDrawAngleLine(tileType, squareTypeList[1])) {
            const upAngleSprite = PIXI.Sprite.fromImage(imageMap.landscape[`angle-${tileType}-2`]);

            upAngleSprite.position.set(0, 0);
            container.addChild(upAngleSprite);
        }
        // --> draw | and -- for bottom
        if (isNeedDrawAngleLine(tileType, squareTypeList[7])) {
            const bottomAngleSprite = PIXI.Sprite.fromImage(imageMap.landscape[`angle-${tileType}-8`]);

            bottomAngleSprite.position.set(0, mapGuide.size.square / 2);
            container.addChild(bottomAngleSprite);
        }

        // --> draw | and -- for left
        if (isNeedDrawAngleLine(tileType, squareTypeList[3])) {
            const leftAngleSprite = PIXI.Sprite.fromImage(imageMap.landscape[`angle-${tileType}-4`]);

            leftAngleSprite.position.set(0, 0);
            container.addChild(leftAngleSprite);
        }

        // --> draw | and -- for right
        if (isNeedDrawAngleLine(tileType, squareTypeList[5])) {
            const rightAngleSprite = PIXI.Sprite.fromImage(imageMap.landscape[`angle-${tileType}-6`]);

            rightAngleSprite.position.set(mapGuide.size.square / 2, 0);
            container.addChild(rightAngleSprite);
        }

        // draw small \ and / --
        // --> draw small \ and / - for left-top
        if (isNeedDrawSmallAngle(tileType, squareTypeList[1], squareTypeList[3], squareTypeList[0])) {
            const leftTopAngleSprite = PIXI.Sprite.fromImage(imageMap.landscape[`angle-${tileType}-1-s`]);

            leftTopAngleSprite.position.set(0, 0);
            container.addChild(leftTopAngleSprite);
        }

        // --> draw small \ and / - for right-top
        if (isNeedDrawSmallAngle(tileType, squareTypeList[1], squareTypeList[5], squareTypeList[2])) {
            const rightTopAngleSprite = PIXI.Sprite.fromImage(imageMap.landscape[`angle-${tileType}-3-s`]);

            rightTopAngleSprite.position.set(mapGuide.size.square / 2, 0);
            container.addChild(rightTopAngleSprite);
        }

        // --> draw small \ and / - for left-bottom
        if (isNeedDrawSmallAngle(tileType, squareTypeList[3], squareTypeList[7], squareTypeList[6])) {
            const leftBottompAngleSprite = PIXI.Sprite.fromImage(imageMap.landscape[`angle-${tileType}-7-s`]);

            leftBottompAngleSprite.position.set(0, mapGuide.size.square / 2);
            container.addChild(leftBottompAngleSprite);
        }

        // --> draw small \ and / - for right-bottom
        if (isNeedDrawSmallAngle(tileType, squareTypeList[5], squareTypeList[7], squareTypeList[8])) {
            const leftBottomAngleSprite = PIXI.Sprite.fromImage(imageMap.landscape[`angle-${tileType}-9-s`]);

            leftBottomAngleSprite.position.set(mapGuide.size.square / 2, mapGuide.size.square / 2);
            container.addChild(leftBottomAngleSprite);
        }

        // draw big \ and / --
        // --> draw big \ and / - for left-top
        if (isNeedDrawBigAngle(tileType, squareTypeList[1], squareTypeList[3])) {
            const leftTopAngleSprite = PIXI.Sprite.fromImage(imageMap.landscape[`angle-${tileType}-1`]);

            leftTopAngleSprite.position.set(0, 0);
            container.addChild(leftTopAngleSprite);
        }

        // --> draw big \ and / - for right-top
        if (isNeedDrawBigAngle(tileType, squareTypeList[1], squareTypeList[5])) {
            const rightTopAngleSprite = PIXI.Sprite.fromImage(imageMap.landscape[`angle-${tileType}-3`]);

            rightTopAngleSprite.position.set(mapGuide.size.square / 2, 0);
            container.addChild(rightTopAngleSprite);
        }

        // --> draw big \ and / - for left-bottom
        if (isNeedDrawBigAngle(tileType, squareTypeList[3], squareTypeList[7])) {
            const leftBottomAngleSprite = PIXI.Sprite.fromImage(imageMap.landscape[`angle-${tileType}-7`]);

            leftBottomAngleSprite.position.set(0, mapGuide.size.square / 2);
            container.addChild(leftBottomAngleSprite);
        }

        // --> draw big \ and / - for right-bottom
        if (isNeedDrawBigAngle(tileType, squareTypeList[5], squareTypeList[7])) {
            const rightBottomAngleSprite = PIXI.Sprite.fromImage(imageMap.landscape[`angle-${tileType}-9`]);

            rightBottomAngleSprite.position.set(mapGuide.size.square / 2, mapGuide.size.square / 2);
            container.addChild(rightBottomAngleSprite);
        }
    }

    addBuilding(container: PIXI.Container) {
        const render = this;

        render.layer.buildings.addChild(container);
    }

    addUnit(container: PIXI.Container) {
        const render = this;

        render.layer.units.addChild(container);
    }

    addGrave(container: PIXI.Container) {
        const render = this;

        render.layer.graves.addChild(container);
    }

    async drawActionsList(actionsList: UnitActionsMapType) {
        const render = this;

        await render.cleanActionsList();

        actionsList.forEach((mapLine: Array<Array<UnitActionType>>) => {
            mapLine.forEach((actionList: Array<UnitActionType>) => {
                // check here action count, if 2 or more - make select action button
                // eslint-disable-next-line complexity
                actionList.forEach((unitAction: UnitActionType) => {
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

                        case 'open-store':
                            render.drawActionOpenStore(unitAction);
                            break;

                        default:
                            console.error('unsupported unit action type', unitAction);
                    }
                });
            });
        });
    }

    drawActionMove(unitAction: UnitActionMoveType) {
        const render = this;
        const {to, container} = unitAction;

        container.position.set(to.x * mapGuide.size.square, to.y * mapGuide.size.square);
        container.buttonMode = true;
        container.interactive = true;
        container.addChild(PIXI.Sprite.fromImage(imageMap.other['action-move']));

        render.layer.actions.addChild(unitAction.container);
    }

    drawActionAttack(unitAction: UnitActionAttackType) {
        const render = this;
        const {defender, container} = unitAction;

        container.position.set(defender.x * mapGuide.size.square, defender.y * mapGuide.size.square);
        container.buttonMode = true;
        container.interactive = true;

        const attackIcon = new PIXI.extras.AnimatedSprite(
            [0, 1, 2, 3].map(
                (spriteNumber: number): PIXI.Texture => {
                    return PIXI.Texture.fromImage(imageMap.other[`action-attack-${spriteNumber}`]);
                }
            )
        );

        attackIcon.animationSpeed = defaultUnitData.render.spriteAnimatedSpeed;

        attackIcon.play();

        container.addChild(attackIcon);

        render.layer.actions.addChild(unitAction.container);
    }

    drawActionFixBuilding(unitAction: UnitActionFixBuildingType) {
        const render = this;
        const {container} = unitAction;

        container.position.set(unitAction.x * mapGuide.size.square, unitAction.y * mapGuide.size.square);
        container.buttonMode = true;
        container.interactive = true;
        container.addChild(PIXI.Sprite.fromImage(imageMap.other['action-fix-building']));

        render.layer.actions.addChild(unitAction.container);
    }

    drawActionOpenStore(unitAction: UnitActionOpenStoreType) {
        const render = this;
        const {container} = unitAction;

        container.position.set(unitAction.x * mapGuide.size.square, unitAction.y * mapGuide.size.square);
        container.buttonMode = true;
        container.interactive = true;
        container.addChild(PIXI.Sprite.fromImage(imageMap.other['open-store']));

        render.layer.actions.addChild(unitAction.container);
    }

    drawActionOccupyBuilding(unitAction: UnitActionOccupyBuildingType) {
        const render = this;
        const {container} = unitAction;

        container.position.set(unitAction.x * mapGuide.size.square, unitAction.y * mapGuide.size.square);
        container.buttonMode = true;
        container.interactive = true;
        container.addChild(PIXI.Sprite.fromImage(imageMap.other['action-occupy-building']));

        render.layer.actions.addChild(unitAction.container);
    }

    drawActionRaiseSkeleton(unitAction: UnitActionRaiseSkeletonType) {
        const render = this;
        const {grave, container} = unitAction;

        container.position.set(grave.x * mapGuide.size.square, grave.y * mapGuide.size.square);
        container.buttonMode = true;
        container.interactive = true;

        const raiseIcon = new PIXI.extras.AnimatedSprite(
            [0, 1, 2, 3].map(
                (spriteNumber: number): PIXI.Texture => {
                    return PIXI.Texture.fromImage(imageMap.other[`action-raise-skeleton-${spriteNumber}`]);
                }
            )
        );

        raiseIcon.animationSpeed = defaultUnitData.render.spriteAnimatedSpeed;

        raiseIcon.play();

        container.addChild(raiseIcon);

        render.layer.actions.addChild(unitAction.container);
    }

    drawActionDestroyBuilding(unitAction: UnitActionDestroyBuildingType) {
        const render = this;
        const {building, container} = unitAction;

        container.position.set(building.x * mapGuide.size.square, building.y * mapGuide.size.square);
        container.buttonMode = true;
        container.interactive = true;

        const attackIcon = new PIXI.extras.AnimatedSprite(
            [0, 1, 2, 3].map(
                (spriteNumber: number): PIXI.Texture => {
                    return PIXI.Texture.fromImage(imageMap.other[`action-destroy-building-${spriteNumber}`]);
                }
            )
        );

        attackIcon.animationSpeed = defaultUnitData.render.spriteAnimatedSpeed;

        attackIcon.play();

        container.addChild(attackIcon);

        render.layer.actions.addChild(unitAction.container);
    }

    async cleanActionsList() {
        const render = this;

        await new Promise((resolve: () => void) => {
            requestAnimationFrame(() => {
                render.layer.actions.removeChildren();
                resolve();
            });
        });
    }

    cleanActionsListSync() {
        const render = this;

        render.layer.actions.removeChildren();
    }

    async drawAttack(aggressorUnit: Unit, defenderUnit: Unit | Building) {
        const deltaPosition = (mapGuide.size.square - mapGuide.size.attackAnimation.square) / 2;
        const render = this;

        const attackSprite = new PIXI.extras.AnimatedSprite(
            [0, 1, 2, 3, 4, 5].map(
                (spriteNumber: number): PIXI.Texture => {
                    return PIXI.Texture.fromImage(imageMap.other[`animation-action-attack-${spriteNumber}`]);
                }
            )
        );

        attackSprite.position.set(
            aggressorUnit.attr.x * mapGuide.size.square,
            aggressorUnit.attr.y * mapGuide.size.square
        );

        attackSprite.animationSpeed = defaultUnitData.render.spriteAnimatedSpeed;

        attackSprite.play();

        render.layer.actions.addChild(attackSprite);

        await tween(
            {x: aggressorUnit.attr.x, y: aggressorUnit.attr.y},
            {x: defenderUnit.attr.x, y: defenderUnit.attr.y},
            defaultUnitData.animation.attack,
            (coordinates: {x: number, y: number}) => {
                attackSprite.position.set(
                    coordinates.x * mapGuide.size.square + deltaPosition,
                    coordinates.y * mapGuide.size.square + deltaPosition
                );
            }
        );

        render.layer.actions.removeChild(attackSprite);
    }

    async drawBuildingAttack(destroyerUnit: Unit, building: Building) {
        const render = this;

        await render.drawAttack(destroyerUnit, building);
    }

    // eslint-disable-next-line max-statements
    drawBorder(width: number, height: number) {
        const render = this;
        const {mainContainer} = render;
        const {square} = mapGuide.size;

        const border = new PIXI.Container();

        const top = -square;
        const right = width - stagePadding.right - stagePadding.left;
        const bottom = height - stagePadding.top - stagePadding.bottom;
        const left = -square;

        const borderSprite1 = PIXI.Sprite.fromImage(borderImage1);
        const borderSprite2 = PIXI.Sprite.fromImage(borderImage2);
        const borderSprite3 = PIXI.Sprite.fromImage(borderImage3);
        const borderSprite4 = PIXI.Sprite.fromImage(borderImage4);
        const borderSprite6 = PIXI.Sprite.fromImage(borderImage6);
        const borderSprite7 = PIXI.Sprite.fromImage(borderImage7);
        const borderSprite8 = PIXI.Sprite.fromImage(borderImage8);
        const borderSprite9 = PIXI.Sprite.fromImage(borderImage9);

        borderSprite1.position.set(left, top);

        borderSprite2.position.set(0, top);
        borderSprite2.width = right;

        borderSprite3.position.set(right, top);

        borderSprite4.position.set(left, 0);
        borderSprite4.height = bottom;

        borderSprite6.position.set(right, 0);
        borderSprite6.height = bottom;

        borderSprite7.position.set(left, bottom);

        borderSprite8.position.set(0, bottom);
        borderSprite8.width = right;

        borderSprite9.position.set(right, bottom);

        border.addChild(borderSprite1);
        border.addChild(borderSprite2);
        border.addChild(borderSprite3);
        border.addChild(borderSprite4);
        border.addChild(borderSprite6);
        border.addChild(borderSprite7);
        border.addChild(borderSprite8);
        border.addChild(borderSprite9);

        mainContainer.addChild(border);
    }

    stopViewportPluginList() {
        const render = this;
        const {viewport} = render;

        if (!viewport) {
            console.log('viewport is not define, stopViewportPluginList', render);
            return;
        }

        viewport.removePlugin('drag');
        viewport.removePlugin('wheel');
        viewport.removePlugin('pinch');
        viewport.removePlugin('decelerate');
        viewport.removePlugin('bounce');
    }

    startViewportPluginList() {
        const render = this;
        const {viewport} = render;

        if (!viewport) {
            console.log('viewport is not define, startViewportPluginList', render);
            return;
        }

        viewport
            .drag()
            .wheel()
            .pinch()
            .decelerate()
            .bounce();
    }

    destroy() {
        const render = this;

        render.stopViewportPluginList();

        render.app.stop();
        render.app.destroy();
    }
}
