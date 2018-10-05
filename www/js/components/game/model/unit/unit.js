// @flow

/* eslint consistent-this: ["error", "unit", "aggressor"] */

import * as PIXI from 'pixi.js';
import type {MapType, MapUserType, UnitActionStateType, UnitType} from '../../../../maps/type';
import type {AttackResultUnitType} from '../helper';
import {bindClick, canOpenStore, getAttackResult, getLevel, getMoviePath, getUserColor} from '../helper';
import mapGuide from '../../../../maps/map-guide';
import type {UnitGuideDataType} from './unit-guide';
import unitGuide, {defaultUnitData} from './unit-guide';
import imageMap from '../../image/image-map';
import Building from '../building/building';
import type {AvailablePathMapType} from './path-master';
import {getPath} from './path-master';
import type {PathType, PointType} from '../../../../lib/a-star-finder/a-star-finder';
import {tweenList} from '../../../../lib/tween/tween';
import find from 'lodash/find';
import Grave from '../grave/grave';
import {fillActionMap} from './helper';
import {isNotNumber, isNotString, isNumber, isString} from '../../../../lib/is/is';

type LevelUpAnimationDataType = {|
    x: number,
    y: number,
    alpha: number
|};

export type UnitActionMoveType = {|
    type: 'move',
    from: {
        x: number,
        y: number
    },
    to: {
        x: number,
        y: number
    },
    id: string,
    container: PIXI.Container
|};

export type UnitActionAttackType = {|
    type: 'attack',
    aggressor: AttackResultUnitType,
    defender: AttackResultUnitType,
    container: PIXI.Container
|};

export type UnitActionFixBuildingType = {|
    type: 'fix-building',
    x: number,
    y: number,
    id: string,
    userId: string,
    container: PIXI.Container
|};

export type UnitActionOccupyBuildingType = {|
    type: 'occupy-building',
    x: number,
    y: number,
    id: string,
    userId: string,
    container: PIXI.Container
|};

export type UnitActionOpenStoreType = {|
    type: 'open-store',
    x: number,
    y: number,
    id: string,
    userId: string,
    container: PIXI.Container
|};

export type UnitActionRaiseSkeletonType = {|
    type: 'raise-skeleton',
    raiser: {|
        x: number,
        y: number,
        id: string,
        userId: string,
        newUnitId: string
    |},
    grave: {|
        x: number,
        y: number
    |},
    userId: string,
    container: PIXI.Container
|};

export type UnitActionDestroyBuildingType = {|
    type: 'destroy-building',
    destroyer: {|
        x: number,
        y: number,
        id: string,
        userId: string
    |},
    building: {|
        x: number,
        y: number,
        type: 'farm-destroyed',
        id: string
    |},
    userId: string,
    container: PIXI.Container
|};

export type RefreshUnitListType = {|
    type: 'refresh-unit-list',
    map: MapType,
    activeUserId: string
|};

export type UnitActionType =
    | UnitActionMoveType
    | UnitActionAttackType
    | RefreshUnitListType
    | UnitActionFixBuildingType
    | UnitActionOccupyBuildingType
    | UnitActionRaiseSkeletonType
    | UnitActionDestroyBuildingType
    | UnitActionOpenStoreType;

export type UnitActionsMapType = Array<Array<Array<UnitActionType>>>;

type UnitAttrType = UnitType;

type UnitGameAttrType = {|
    container: PIXI.Container,
    sprite: {|
        unit: PIXI.extras.AnimatedSprite,
        hitPoints: PIXI.Container,
        level: PIXI.Container,
        poisonCountdown: PIXI.Sprite,
        wispAura: PIXI.Sprite
    |},
    userList: Array<MapUserType>,
    event: {|
        // eslint-disable-next-line no-use-before-define
        click: (unit: Unit) => Promise<void>
    |},
    hasWispAura: boolean,
    isActionAvailable: boolean
|};

export type UnitConstructorType = {|
    unitData: UnitType,
    userList: Array<MapUserType>,
    event: {|
        // eslint-disable-next-line no-use-before-define
        click: (unit: Unit) => Promise<void>
    |}
|};

export type GameDataType = {|
    +userList: Array<MapUserType>,
    +buildingList: Array<Building>,
    // eslint-disable-next-line no-use-before-define
    +unitList: Array<Unit>,
    // eslint-disable-next-line no-use-before-define
    +graveList: Array<Grave>,
    +pathMap: {
        +walk: Array<Array<number>>,
        +flow: Array<Array<number>>,
        +fly: Array<Array<number>>
    },
    +armorMap: {
        +walk: Array<Array<number>>,
        +flow: Array<Array<number>>,
        +fly: Array<Array<number>>
    },
    +emptyActionMap: Array<Array<[]>>
|};

/*
const textStyle = new PIXI.TextStyle({
    fontFamily: 'monospace',
    fill: '#cccc00',
    fontSize: 8,
    stroke: '#000000',
    strokeThickness: 4
});
*/

const textStyleRed = new PIXI.TextStyle({
    fontFamily: 'monospace',
    fill: '#cc0000',
    fontSize: 8,
    stroke: '#000000',
    strokeThickness: 4
});

export default class Unit {
    attr: UnitAttrType;
    gameAttr: UnitGameAttrType;

    constructor(unitConstructor: UnitConstructorType): Unit {
        const unit = this;

        unit.initialize(unitConstructor);

        return unit;
    }

    initialize(unitConstructor: UnitConstructorType) {
        const unit = this;
        const {unitData} = unitConstructor;

        if (isNotString(unitData.userId) || isNotString(unitData.id)) {
            console.error('---> unitData has NO .userId or/and .id', unitData);
        }

        unit.attr = JSON.parse(JSON.stringify(unitData));

        unit.gameAttr = {
            container: new PIXI.Container(),
            sprite: {
                unit: new PIXI.extras.AnimatedSprite([
                    PIXI.Texture.fromImage(imageMap.unit[unit.attr.type + '-gray-0']),
                    PIXI.Texture.fromImage(imageMap.unit[unit.attr.type + '-gray-1'])
                ]),
                hitPoints: new PIXI.Container(),
                level: new PIXI.Container(),
                poisonCountdown: PIXI.Sprite.fromImage(imageMap.other['under-poison']),
                wispAura: PIXI.Sprite.fromImage(imageMap.other['under-wisp-aura'])
            },
            userList: JSON.parse(JSON.stringify(unitConstructor.userList)),
            event: {
                click: unitConstructor.event.click
            },
            hasWispAura: false,
            isActionAvailable: false
        };

        unit.initializeUnitSprite();
        unit.initializeHitPointsSprite();
        unit.initializeLevelSprite();
        unit.initializePoisonCountdownSprite();
        unit.bindUnitEventListeners();
    }

    // eslint-disable-next-line complexity
    initializeUnitSprite() {
        const unit = this;
        const {attr, gameAttr} = unit;
        const {square} = mapGuide.size;

        let color = 'gray';

        gameAttr.container.position.set(attr.x * square, attr.y * square);

        if (isString(attr.userId)) {
            const userColor = getUserColor(attr.userId, gameAttr.userList);

            if (isString(userColor)) {
                color = userColor;
            }
        }

        gameAttr.sprite.unit = new PIXI.extras.AnimatedSprite([
            PIXI.Texture.fromImage(imageMap.unit[attr.type + '-' + color + '-0']),
            PIXI.Texture.fromImage(imageMap.unit[attr.type + '-' + color + '-1'])
        ]);

        gameAttr.sprite.unit.animationSpeed = defaultUnitData.render.spriteAnimatedSpeed;

        gameAttr.sprite.unit.play();

        gameAttr.container.addChild(gameAttr.sprite.unit);
    }

    initializeHitPointsSprite() {
        const unit = this;
        const {attr, gameAttr} = unit;
        const hitPoints = unit.getHitPoints();
        const {square} = mapGuide.size;

        const number0 = PIXI.Sprite.fromImage(imageMap.font.unit.space);
        const number1 = PIXI.Sprite.fromImage(imageMap.font.unit.space);

        number0.position.set(0, square);
        number0.anchor.set(0, 1);
        number1.position.set(mapGuide.font.unit.width, square);
        number1.anchor.set(0, 1);

        gameAttr.sprite.hitPoints.addChild(number0);
        gameAttr.sprite.hitPoints.addChild(number1);

        gameAttr.container.addChild(gameAttr.sprite.hitPoints);

        if (hitPoints !== defaultUnitData.hitPoints) {
            // here is not needed 'await'
            unit.setHitPoints(hitPoints)
                .then((): void => console.log('setHitPoints has been set', unit))
                .catch((error: Error) => {
                    console.error('error with unit setHitPoints');
                    console.error(error);
                });
        }

        if (hitPoints > defaultUnitData.hitPoints) {
            console.error('hitPoints bigger than default hitPoints!', unit);
        }
    }

    initializeLevelSprite() {
        const unit = this;
        const {attr, gameAttr} = unit;
        const level = unit.getLevel();
        const levelNumberSprite = PIXI.Sprite.fromImage(imageMap.font.unit.space);

        levelNumberSprite.tint = 0xEEEE00;

        gameAttr.sprite.level.addChild(levelNumberSprite);

        if (level > defaultUnitData.level.max) {
            console.error('level bigger than defaultUnitData.level.max!', unit);
        }

        if (level !== defaultUnitData.level.min) {
            unit.setLevel(level)
                .then((): void => console.log('level has been set'))
                .catch((error: Error) => {
                    console.error('error with unit setLevel');
                    console.error(error);
                });
        }

        gameAttr.container.addChild(gameAttr.sprite.level);
    }

    initializePoisonCountdownSprite() {
        const unit = this;
        const {attr, gameAttr} = unit;
        const poisonCountdown = unit.getPoisonCountdown();
        const {square} = mapGuide.size;

        gameAttr.sprite.poisonCountdown.position.set(square, 0);
        gameAttr.sprite.poisonCountdown.anchor.set(1, 0);
        gameAttr.sprite.poisonCountdown.alpha = 0;

        // if (poisonCountdown !== defaultUnitData.poisonCountdown) {
        if (isNumber(attr.poisonCountdown)) {
            unit.setPoisonCountdown(poisonCountdown);
        }

        gameAttr.container.addChild(gameAttr.sprite.poisonCountdown);
    }

    // eslint-disable-next-line complexity, max-statements, sonarjs/cognitive-complexity
    getActions(gameData: GameDataType): UnitActionsMapType | null {
        const unit = this;

        if (
            unit.getDidAttack() ||
            unit.getDidFixBuilding() ||
            unit.getDidOccupyBuilding() ||
            unit.getDidDestroyBuilding() ||
            unit.getDidRaiseSkeleton()
        ) {
            return null;
        }

        const actionMap: UnitActionsMapType = JSON.parse(JSON.stringify(gameData.emptyActionMap));

        const isDidMoved = unit.getDidMove();

        let isAvailableAttack = !isDidMoved;
        let isAvailableFixBuilding = !isDidMoved;
        let isAvailableOccupyBuilding = !isDidMoved;
        let isAvailableDestroyBuilding = !isDidMoved;
        let isAvailableRaiseSkeleton = !isDidMoved;

        if (!isDidMoved) {
            // add move
            const actionMapMove = unit.getMoveActions(gameData);

            fillActionMap(actionMapMove, actionMap);
        }

        // add attack
        const actionMapAttack = unit.getAttackActions(gameData);

        actionMapAttack.forEach((lineAction: Array<Array<UnitActionType>>, yCell: number) => {
            lineAction.forEach((cellAction: Array<UnitActionType>, xCell: number) => {
                if (cellAction[0]) {
                    isAvailableAttack = true;
                    actionMap[yCell][xCell][0] = cellAction[0];
                }
            });
        });

        // add fix building
        const actionMapFixBuilding = unit.getFixBuildingActions(gameData);

        actionMapFixBuilding.forEach((lineAction: Array<Array<UnitActionType>>, yCell: number) => {
            lineAction.forEach((cellAction: Array<UnitActionType>, xCell: number) => {
                if (cellAction[0]) {
                    isAvailableFixBuilding = true;
                    actionMap[yCell][xCell][0] = cellAction[0];
                }
            });
        });

        // add occupy building
        const actionMapOccupyBuilding = unit.getOccupyBuildingActions(gameData);

        actionMapOccupyBuilding.forEach((lineAction: Array<Array<UnitActionType>>, yCell: number) => {
            lineAction.forEach((cellAction: Array<UnitActionType>, xCell: number) => {
                if (cellAction[0]) {
                    isAvailableOccupyBuilding = true;
                    actionMap[yCell][xCell][0] = cellAction[0];
                }
            });
        });

        // add destroy building
        const actionMapDestroyBuilding = unit.getDestroyBuildingActions(gameData);

        actionMapDestroyBuilding.forEach((lineAction: Array<Array<UnitActionType>>, yCell: number) => {
            lineAction.forEach((cellAction: Array<UnitActionType>, xCell: number) => {
                if (cellAction[0]) {
                    isAvailableDestroyBuilding = true;
                    actionMap[yCell][xCell][0] = cellAction[0];
                }
            });
        });

        // add raise skeleton
        const actionMapRaiseSkeleton = unit.getRaiseSkeletonActions(gameData);

        actionMapRaiseSkeleton.forEach((lineAction: Array<Array<UnitActionType>>, yCell: number) => {
            lineAction.forEach((cellAction: Array<UnitActionType>, xCell: number) => {
                if (cellAction[0]) {
                    isAvailableRaiseSkeleton = true;
                    actionMap[yCell][xCell][0] = cellAction[0];
                }
            });
        });

        if (
            isDidMoved &&
            !isAvailableAttack &&
            !isAvailableFixBuilding &&
            !isAvailableOccupyBuilding &&
            !isAvailableDestroyBuilding &&
            !isAvailableRaiseSkeleton
        ) {
            return null;
        }

        return actionMap;
    }

    // eslint-disable-next-line complexity, max-statements
    getOpenStoreActions(gameData: GameDataType): UnitActionsMapType | null {
        const unit = this;
        const actionMap: UnitActionsMapType = JSON.parse(JSON.stringify(gameData.emptyActionMap));

        const actionMapOpenStore = unit.getOpenStoreMapActions(gameData);

        if (actionMapOpenStore === null) {
            return null;
        }

        fillActionMap(actionMapOpenStore, actionMap);

        return actionMap;
    }

    getMoveActions(gameData: GameDataType): UnitActionsMapType {
        const unit = this;
        const {attr} = unit;
        const moveMap: UnitActionsMapType = JSON.parse(JSON.stringify(gameData.emptyActionMap));
        const unitId = isString(attr.id) ? attr.id : null;

        if (unitId === null) {
            // eslint-disable-next-line sonarjs/no-duplicate-string
            console.error('unit has no id', unit);
            return moveMap;
        }

        unit.getAvailablePath(gameData).forEach((cell: [number, number]) => {
            moveMap[cell[1]][cell[0]].push({
                id: unitId,
                type: 'move',
                from: {
                    x: attr.x,
                    y: attr.y
                },
                to: {
                    x: cell[0],
                    y: cell[1]
                },
                container: new PIXI.Container()
            });
        });

        return moveMap;
    }

    getAttackActions(gameData: GameDataType): UnitActionsMapType {
        const unit = this;
        const {attr} = unit;
        const attackMap: UnitActionsMapType = JSON.parse(JSON.stringify(gameData.emptyActionMap));
        const unitId = isString(attr.id) ? attr.id : null;

        if (unitId === null) {
            console.error('unit has no id', unit);
            return attackMap;
        }

        const attackMapPointList = unit.getAvailableAttack(gameData);

        // get attack fields
        attackMapPointList.forEach((cell: [number, number]) => {
            const defender = find(gameData.unitList, {attr: {x: cell[0], y: cell[1]}}) || null;

            if (defender === null) {
                console.error('Can not find unit by coordinates:', cell);
                return;
            }

            const attackResult = getAttackResult(gameData, unit, defender);

            attackMap[cell[1]][cell[0]].push({
                type: 'attack',
                aggressor: attackResult.aggressor,
                defender: attackResult.defender,
                container: new PIXI.Container()
            });
        });

        return attackMap;
    }

    // eslint-disable-next-line complexity, max-statements
    getFixBuildingActions(gameData: GameDataType): UnitActionsMapType {
        const unit = this;
        const {attr} = unit;
        const fixBuildingMap: UnitActionsMapType = JSON.parse(JSON.stringify(gameData.emptyActionMap));
        const unitId = isString(attr.id) ? attr.id : null;
        const userId = isString(attr.userId) ? attr.userId : null;

        if (unitId === null) {
            console.error('unit has no id', unit);
            return fixBuildingMap;
        }

        if (userId === null) {
            // eslint-disable-next-line sonarjs/no-duplicate-string
            console.error('unit has no userId', unit);
            return fixBuildingMap;
        }

        const unitGuideData = unit.getGuideData();

        if (unitGuideData.canFixBuilding !== true) {
            console.log('unit can not fix building');
            return [];
        }

        // find building for fix
        const unitX = attr.x;
        const unitY = attr.y;

        const building = find(gameData.buildingList, {attr: {type: 'farm-destroyed', x: unitX, y: unitY}}) || null;

        if (building === null) {
            return [];
        }

        fixBuildingMap[unitY][unitX].push({
            type: 'fix-building',
            id: unitId,
            userId,
            x: unitX,
            y: unitY,
            container: new PIXI.Container()
        });

        return fixBuildingMap;
    }

    // eslint-disable-next-line complexity, max-statements
    getOccupyBuildingActions(gameData: GameDataType): UnitActionsMapType {
        const unit = this;
        const {attr} = unit;
        const occupyBuildingMap: UnitActionsMapType = JSON.parse(JSON.stringify(gameData.emptyActionMap));
        const unitId = isString(attr.id) ? attr.id : null;
        const userId = isString(attr.userId) ? attr.userId : null;

        if (unitId === null) {
            console.error('unit has no id', unit);
            return occupyBuildingMap;
        }

        if (userId === null) {
            console.error('unit has no userId', unit);
            return occupyBuildingMap;
        }

        const unitGuideData = unit.getGuideData();

        if (!Array.isArray(unitGuideData.occupyBuildingList)) {
            console.log('unit can not occupy building');
            return [];
        }

        // find building for occupy
        const unitX = attr.x;
        const unitY = attr.y;

        const building =
            find(
                gameData.buildingList,
                (buildingInList: Building): boolean => {
                    return (
                        buildingInList.attr.x === unitX &&
                        buildingInList.attr.y === unitY &&
                        buildingInList.attr.userId !== userId &&
                        Array.isArray(unitGuideData.occupyBuildingList) &&
                        unitGuideData.occupyBuildingList.includes(buildingInList.attr.type)
                    );
                }
            ) || null;

        if (building === null) {
            return [];
        }

        occupyBuildingMap[unitY][unitX].push({
            type: 'occupy-building',
            id: unitId,
            userId,
            x: unitX,
            y: unitY,
            container: new PIXI.Container()
        });

        return occupyBuildingMap;
    }

    // eslint-disable-next-line complexity, max-statements
    getOpenStoreMapActions(gameData: GameDataType): UnitActionsMapType | null {
        const unit = this;
        const {attr} = unit;
        const openStoreMap: UnitActionsMapType = JSON.parse(JSON.stringify(gameData.emptyActionMap));
        const unitId = isString(attr.id) ? attr.id : null;
        const userId = isString(attr.userId) ? attr.userId : null;

        if (unitId === null) {
            console.error('unit has no id', unit);
            return openStoreMap;
        }

        if (userId === null) {
            console.error('unit has no userId', unit);
            return openStoreMap;
        }

        // find building to open store
        const unitX = attr.x;
        const unitY = attr.y;

        const building = find(gameData.buildingList, {attr: {x: unitX, y: unitY, type: 'castle', userId}}) || null;

        if (building === null) {
            return null;
        }

        if (!canOpenStore(building.attr.x, building.attr.y, gameData)) {
            return null;
        }

        openStoreMap[unitY][unitX].push({
            type: 'open-store',
            id: unitId,
            userId,
            x: unitX,
            y: unitY,
            container: new PIXI.Container()
        });

        return openStoreMap;
    }

    // eslint-disable-next-line complexity, max-statements
    getDestroyBuildingActions(gameData: GameDataType): UnitActionsMapType {
        const unit = this;
        const {attr} = unit;
        const destroyBuildingMap: UnitActionsMapType = JSON.parse(JSON.stringify(gameData.emptyActionMap));
        const unitId = isString(attr.id) ? attr.id : null;
        const userId = isString(attr.userId) ? attr.userId : null;

        if (unitId === null) {
            console.error('unit has no id', unit);
            return destroyBuildingMap;
        }

        if (userId === null) {
            console.error('unit has no userId', unit);
            return destroyBuildingMap;
        }

        const unitGuideData = unit.getGuideData();

        if (!unitGuideData.destroyBuildingList || unitGuideData.destroyBuildingList.length === 0) {
            console.log('unit can not destroy building');
            return destroyBuildingMap;
        }

        const destroyBuildingList = unitGuideData.destroyBuildingList;

        const attackBuildingMapPointList = unit.getAllAvailableAttack(gameData);

        attackBuildingMapPointList.forEach((cell: [number, number]) => {
            const building =
                find(
                    gameData.buildingList,
                    (buildingInList: Building): boolean => {
                        return (
                            destroyBuildingList.includes(buildingInList.attr.type) &&
                            isString(buildingInList.attr.userId) &&
                            buildingInList.attr.userId !== userId &&
                            buildingInList.attr.x === cell[0] &&
                            buildingInList.attr.y === cell[1]
                        );
                    }
                ) || null;

            if (building === null) {
                // console.log('can not find building in ', cell);
                return;
            }

            destroyBuildingMap[cell[1]][cell[0]].push({
                type: 'destroy-building',
                building: {
                    x: building.attr.x,
                    y: building.attr.y,
                    type: 'farm-destroyed',
                    id: isString(building.attr.id) ? building.attr.id : 'no-building-id-' + Math.random()
                },
                destroyer: {
                    x: unit.attr.x,
                    y: unit.attr.y,
                    id: unitId,
                    userId
                },
                userId,
                container: new PIXI.Container()
            });
        });

        return destroyBuildingMap;
    }

    // eslint-disable-next-line complexity, max-statements
    getRaiseSkeletonActions(gameData: GameDataType): UnitActionsMapType {
        const unit = this;
        const {attr} = unit;
        const raiseSkeletonMap: UnitActionsMapType = JSON.parse(JSON.stringify(gameData.emptyActionMap));
        const unitId = isString(attr.id) ? attr.id : null;
        const userId = isString(attr.userId) ? attr.userId : null;

        if (unitId === null) {
            console.error('unit has no id', unit);
            return raiseSkeletonMap;
        }

        if (userId === null) {
            console.error('unit has no userId', unit);
            return raiseSkeletonMap;
        }

        const unitGuideData = unit.getGuideData();

        if (isNotNumber(unitGuideData.raiseSkeletonRange)) {
            console.log('unit can not raise skeleton');
            return raiseSkeletonMap;
        }

        const raiseSkeletonMapPointList = getPath(
            unit.attr.x,
            unit.attr.y,
            unitGuideData.raiseSkeletonRange,
            gameData.pathMap.fly,
            []
        );

        // get attack fields
        raiseSkeletonMapPointList.forEach((cell: [number, number]) => {
            const grave = find(gameData.graveList, {attr: {x: cell[0], y: cell[1]}}) || null;

            if (grave === null) {
                console.log('No grave by coordinates:', cell);
                return;
            }

            // check unit on grave
            const unitOnGrave = find(gameData.unitList, {attr: {x: grave.attr.x, y: grave.attr.y}}) || null;

            if (unitOnGrave !== null) {
                console.log('Grave under unit, can not raise skeleton', unitOnGrave);
                return;
            }

            raiseSkeletonMap[cell[1]][cell[0]].push({
                type: 'raise-skeleton',
                raiser: {
                    x: unit.attr.x,
                    y: unit.attr.y,
                    id: unitId,
                    userId,
                    newUnitId: [grave.attr.x, grave.attr.y, Math.random()].join('_')
                },
                grave: {
                    x: grave.attr.x,
                    y: grave.attr.y
                },
                userId,
                container: new PIXI.Container()
            });
        });

        return raiseSkeletonMap;
    }

    getAllUnitsCoordinates(gameData: GameDataType): Array<[number, number]> {
        const {unitList} = gameData;

        return unitList.map((unit: Unit): [number, number] => [unit.attr.x, unit.attr.y]);
    }

    getAllEnemyUnitsCoordinates(gameData: GameDataType): Array<[number, number]> {
        const unit = this;
        const {attr} = unit;
        const {unitList} = gameData;
        const userId = isString(attr.userId) ? attr.userId : null;

        if (userId === null) {
            console.error('unit has no user id', unit);
            return [];
        }

        return unitList
            .filter(
                (unitInList: Unit): boolean => {
                    return unitInList.attr.userId !== userId;
                }
            )
            .map((unitInList: Unit): [number, number] => [unitInList.attr.x, unitInList.attr.y]);
    }

    getAvailablePath(gameData: GameDataType): AvailablePathMapType {
        console.warn('---> reduce path if unit poisoned!');
        const unit = this;
        const {x, y, type} = unit.attr;

        if (!unitGuide.hasOwnProperty(type)) {
            // eslint-disable-next-line sonarjs/no-duplicate-string
            console.error('unitGuide has no property:', type, unit);
            return [];
        }

        const unitGuideData = unitGuide[type];

        const moveType = isString(unitGuideData.moveType) ? unitGuideData.moveType : null;

        const pathMap = moveType === null ? gameData.pathMap.walk : gameData.pathMap[moveType];

        return getPath(x, y, unitGuideData.move, pathMap, unit.getAllUnitsCoordinates(gameData));
    }

    getAvailableAttack(gameData: GameDataType): AvailablePathMapType {
        const unit = this;
        const {x, y, type} = unit.attr;

        if (!unitGuide.hasOwnProperty(type)) {
            console.error('unitGuide has no property:', type, unit);
            return [];
        }

        const enemyUnitCoordinates = unit.getAllEnemyUnitsCoordinates(gameData);

        return unit.getAllAvailableAttack(gameData).filter(
            (mapPoint: PointType): boolean => {
                return enemyUnitCoordinates.some(
                    (unitCoordinates: [number, number]): boolean => {
                        return unitCoordinates[0] === mapPoint[0] && unitCoordinates[1] === mapPoint[1];
                    }
                );
            }
        );
    }

    getAllAvailableAttack(gameData: GameDataType): AvailablePathMapType {
        const unit = this;
        const {x, y, type} = unit.attr;

        if (!unitGuide.hasOwnProperty(type)) {
            console.error('unitGuide has no property:', type, unit);
            return [];
        }

        const unitGuideData = unitGuide[type];

        return getPath(x, y, unitGuideData.attack.range, gameData.pathMap.fly, []);
    }

    // eslint-disable-next-line complexity
    bindUnitEventListeners() {
        const unit = this;
        const {attr, gameAttr} = unit;
        const {square} = mapGuide.size;

        const unitContainer = unit.gameAttr.container;

        unitContainer.interactive = true;
        unitContainer.buttonMode = true;

        bindClick(
            unitContainer,
            async (): Promise<void> => {
                console.log('click on unit', unit);
                await unit.gameAttr.event.click(unit);
            }
        );
    }

    move(x: number, y: number, movePath: PathType, callback?: (x: number, y: number) => void): Promise<void> {
        const unit = this;
        const {attr, gameAttr} = unit;
        const {square} = mapGuide.size;

        attr.x = x;
        attr.y = y;

        unit.setDidMove(true);

        return tweenList(movePath, defaultUnitData.animation.moveStep, (pathPoint: PointType) => {
            gameAttr.container.position.set(pathPoint[0] * square, pathPoint[1] * square);

            if (typeof callback !== 'function') {
                return;
            }

            callback(pathPoint[0], pathPoint[1]);
        })
            .then((): void => console.log('unit move is end'))
            .catch((error: Error) => {
                console.error('error with unit move');
                console.error(error);
            });
    }

    // eslint-disable-next-line complexity
    async setActionState(actionState: UnitActionStateType | null): Promise<void> {
        const unit = this;
        const currentActionState = unit.attr.action || null;

        if (actionState === null && currentActionState === null) {
            console.log('old and new action state is null');
            return Promise.resolve();
        }

        if (actionState === null && currentActionState !== null) {
            console.error(
                'old action state !==  null, but new action state === null!!!, ' +
                    "the game has not method to remove unit's action"
            );
            return Promise.resolve();
        }

        if (actionState === null) {
            console.log('action state did not passed');
            return Promise.resolve();
        }

        const promiseList = [];

        // eslint-disable-next-line max-statements, complexity
        Object.keys(actionState).forEach((actionName: string) => {
            const oldAction = unit.attr.action || {};

            if (actionState === null) {
                console.error('actionState is null, is is impossible, cause we check for null couple line ago!!!');
                return;
            }

            if (actionState[actionName] === oldAction[actionName]) {
                console.log('old action state value === new action state value');
                return;
            }

            switch (actionName) {
                case 'didMove':
                    console.log('setDidMove', actionState[actionName]);
                    unit.setDidMove(Boolean(actionState[actionName]));
                    break;

                case 'didAttack':
                    console.log('setDidAttack', actionState[actionName]);
                    unit.setDidAttack(Boolean(actionState[actionName]));
                    break;

                case 'didFixBuilding':
                    console.log('didFixBuilding', actionState[actionName]);
                    unit.setDidFixBuilding(Boolean(actionState[actionName]));
                    break;

                case 'didOccupyBuilding':
                    console.log('didOccupyBuilding', actionState[actionName]);
                    unit.setDidOccupyBuilding(Boolean(actionState[actionName]));
                    break;

                case 'didRaiseSkeleton':
                    console.log('didRaiseSkeleton', actionState[actionName]);
                    unit.setDidRaiseSkeleton(Boolean(actionState[actionName]));
                    break;

                case 'didDestroyBuilding':
                    console.log('didDestroyBuilding', actionState[actionName]);
                    unit.setDidDestroyBuilding(Boolean(actionState[actionName]));
                    break;

                default:
                    console.error('unsupported action name', actionName, actionState);
            }
        });

        return Promise.all(promiseList)
            .then((): void => console.log('unit setActionState done'))
            .catch((error: Error) => {
                console.error('error (in list) with unit setActionState');
                console.error(error);
            });
    }

    setDidMove(didMove: boolean) {
        const unit = this;
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        unitActionState.didMove = didMove;
        attr.action = unitActionState;
    }

    getDidMove(): boolean {
        const unit = this;
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        return Boolean(unitActionState.didMove);
    }

    setDidAttack(didAttack: boolean) {
        const unit = this;
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        unitActionState.didAttack = didAttack;
        attr.action = unitActionState;
    }

    getDidAttack(): boolean {
        const unit = this;
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        return Boolean(unitActionState.didAttack);
    }

    setDidFixBuilding(didFixBuilding: boolean) {
        const unit = this;
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        unitActionState.didFixBuilding = didFixBuilding;
        attr.action = unitActionState;
    }

    getDidFixBuilding(): boolean {
        const unit = this;
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        return Boolean(unitActionState.didFixBuilding);
    }

    setDidOccupyBuilding(didOccupyBuilding: boolean) {
        const unit = this;
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        unitActionState.didOccupyBuilding = didOccupyBuilding;
        attr.action = unitActionState;
    }

    getDidOccupyBuilding(): boolean {
        const unit = this;
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        return Boolean(unitActionState.didOccupyBuilding);
    }

    setDidDestroyBuilding(didDestroyBuilding: boolean) {
        const unit = this;
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        unitActionState.didDestroyBuilding = didDestroyBuilding;
        attr.action = unitActionState;
    }

    getDidDestroyBuilding(): boolean {
        const unit = this;
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        return Boolean(unitActionState.didDestroyBuilding);
    }

    setDidRaiseSkeleton(didRaiseSkeleton: boolean) {
        const unit = this;
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        unitActionState.didRaiseSkeleton = didRaiseSkeleton;
        attr.action = unitActionState;
    }

    getDidRaiseSkeleton(): boolean {
        const unit = this;
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        return Boolean(unitActionState.didRaiseSkeleton);
    }

    setDamageGiven(damageGiven: number) {
        const unit = this;

        unit.attr.damage = unit.attr.damage || {};

        unit.attr.damage.given = damageGiven;
    }

    setDamageGivenUpdateBy(damageGivenDelta: number) {
        const unit = this;

        unit.setDamageGiven(unit.getDamageGiven() + damageGivenDelta);
    }

    getDamageGiven(): number {
        const unit = this;
        const {damage} = unit.attr;

        return damage && isNumber(damage.given) ? damage.given : 0;
    }

    setDamageReceived(damageReceived: number) {
        const unit = this;

        unit.attr.damage = unit.attr.damage || {};

        unit.attr.damage.received = damageReceived;
    }

    setDamageReceivedUpdateBy(damageReceivedDelta: number) {
        const unit = this;

        unit.setDamageReceived(unit.getDamageReceived() + damageReceivedDelta);
    }

    getDamageReceived(): number {
        const unit = this;
        const {damage} = unit.attr;

        return damage && isNumber(damage.received) ? damage.received : 0;
    }

    setPoisonCountdown(poisonCountdown: number) {
        const unit = this;
        const {attr, gameAttr} = unit;

        attr.poisonCountdown = poisonCountdown;

        gameAttr.sprite.poisonCountdown.alpha = poisonCountdown === defaultUnitData.poisonCountdown ? 0 : 1;
    }

    decreasePoisonCountdown() {
        const unit = this;

        const poisonCountdown = unit.getPoisonCountdown();

        if (poisonCountdown === 0) {
            return;
        }

        unit.setPoisonCountdown(poisonCountdown - 1);
    }

    getPoisonCountdown(): number {
        const unit = this;

        return isNumber(unit.attr.poisonCountdown) ? unit.attr.poisonCountdown : defaultUnitData.poisonCountdown;
    }

    hasId(): boolean {
        const unit = this;

        return isString(unit.attr.id) && unit.attr.id.length > 0;
    }

    getId(): string | null {
        const unit = this;

        if (isString(unit.attr.id) && unit.attr.id.length > 0) {
            return unit.attr.id;
        }

        console.error('unit has no id', unit);

        return null;
    }

    hasUserId(): boolean {
        const unit = this;

        return isString(unit.attr.userId) && unit.attr.userId.length > 0;
    }

    getUserId(): string | null {
        const unit = this;

        if (isString(unit.attr.userId) && unit.attr.userId.length > 0) {
            return unit.attr.userId;
        }

        console.error('unit has no userId', unit);

        return null;
    }

    // eslint-disable-next-line complexity
    async setLevel(level: number): Promise<void> {
        const unit = this;
        const {attr, gameAttr} = unit;
        const currentSpriteNumber = gameAttr.sprite.level.getChildAt(0) || null;
        const levelSting = String(level);
        const newSpriteNumber = PIXI.Sprite.fromImage(imageMap.font.unit[levelSting]);

        if (level === 0) {
            console.log('no set zero level');
            return;
        }

        if (currentSpriteNumber !== null && currentSpriteNumber.texture === newSpriteNumber.texture) {
            console.log('set new level is not needed, new level and current level the same');
            return;
        }

        if (level > defaultUnitData.level.max) {
            console.error('too high level', level, unit);
            await unit.setLevel(defaultUnitData.level.max);
            return;
        }

        if (currentSpriteNumber === null) {
            console.error('currentSpriteNumber is not exist');
            return;
        }

        await unit.showLevelUp();

        currentSpriteNumber.texture = newSpriteNumber.texture;
    }

    async actualizeLevel(): Promise<void> {
        const unit = this;

        await unit.setLevel(unit.getLevel());
    }

    getLevel(): number {
        const unit = this;
        const damageGiven = unit.getDamageGiven();

        return getLevel(damageGiven);
    }

    async showLevelUp(): Promise<void> {
        const unit = this;
        const {attr, gameAttr} = unit;
        const {square} = mapGuide.size;

        const levelUpSprite = PIXI.Sprite.fromImage(imageMap.other['level-up']);

        gameAttr.container.addChild(levelUpSprite);

        levelUpSprite.anchor.set(0.5, 1);
        levelUpSprite.position.set(square / 2, square);
        levelUpSprite.alpha = 0;

        const animationFrom: LevelUpAnimationDataType = {
            x: square / 2,
            y: square,
            alpha: 0
        };

        const animationShow: LevelUpAnimationDataType = {
            x: square / 2,
            y: 0,
            alpha: 1
        };

        const animationTo: LevelUpAnimationDataType = {
            x: square / 2,
            y: square / 2,
            alpha: 0
        };

        await tweenList(
            [animationFrom, animationShow, animationShow, animationTo],
            defaultUnitData.animation.levelUp,
            (animationCurrent: LevelUpAnimationDataType) => {
                levelUpSprite.position.set(animationCurrent.x, animationCurrent.y);
                levelUpSprite.alpha = animationCurrent.alpha;
            }
        );

        gameAttr.container.removeChild(levelUpSprite);
    }

    getPoisonAttack(): number {
        const unit = this;
        const guideData = unit.getGuideData();

        return isNumber(guideData.poisonAttack) ? guideData.poisonAttack : 0;
    }

    /*
    set___(___: boolean) {
        const unit = this;
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        unitActionState.___ = ___;
        attr.action = unitActionState;
    }

    get___(): boolean {
        const unit = this;
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        return Boolean(unitActionState.___);
    }
    */

    // eslint-disable-next-line complexity, max-statements
    async setHitPoints(hitPoints: number): Promise<void> {
        const unit = this;
        const {attr, gameAttr} = unit;

        if (hitPoints > defaultUnitData.hitPoints) {
            console.error('too many hitPoints', hitPoints, unit);
            await unit.setHitPoints(defaultUnitData.hitPoints);
            return;
        }

        if (hitPoints === 0) {
            console.error('hitPoints is 0, remove from Game unit and create a grave', unit);
            return;
        }

        const currentHitPoints = isNumber(attr.hitPoints) ? attr.hitPoints : defaultUnitData.hitPoints;
        const hitPointsDelta = hitPoints - currentHitPoints;

        attr.hitPoints = hitPoints;

        await unit.showDeltaHitPoints(hitPointsDelta);

        const number0 = gameAttr.sprite.hitPoints.getChildAt(0);
        const number1 = gameAttr.sprite.hitPoints.getChildAt(1);

        if (!number0 || !number1) {
            console.error('unit has NO sprites for health');
            return;
        }

        if (hitPoints === defaultUnitData.hitPoints) {
            number0.texture = PIXI.Texture.fromImage(imageMap.font.unit.space);
            number1.texture = PIXI.Texture.fromImage(imageMap.font.unit.space);
            return;
        }

        const hitPointString = hitPoints.toString(10);

        if (hitPointString.length === 2) {
            number0.texture = PIXI.Texture.fromImage(imageMap.font.unit[hitPointString[0]]);
            number1.texture = PIXI.Texture.fromImage(imageMap.font.unit[hitPointString[1]]);
        } else {
            number0.texture = PIXI.Texture.fromImage(imageMap.font.unit.space);
            number1.texture = PIXI.Texture.fromImage(imageMap.font.unit[hitPointString[0]]);
        }

        let hitPointsTint = 0xDDDD00; // yellow;

        if (hitPoints >= 80) {
            hitPointsTint = 0x00DD00; // green
        } else if (hitPoints < 40) {
            hitPointsTint = 0xDD0000; // red
        }

        number0.tint = hitPointsTint;
        number1.tint = hitPointsTint;
    }

    getHitPoints(): number {
        const unit = this;
        const {attr} = unit;

        if (isNumber(attr.hitPoints)) {
            return attr.hitPoints;
        }
        return defaultUnitData.hitPoints;
    }

    // eslint-disable-next-line complexity, max-statements
    async showDeltaHitPoints(hitPointsDelta: number): Promise<void> {
        if (hitPointsDelta === 0) {
            console.log('hitPointsDelta is === 0');
            return;
        }

        const hitPointsDeltaString = String(Math.abs(hitPointsDelta));

        if (hitPointsDeltaString.length > 3) {
            console.error('hitPointsDelta is >= 100, unit has 2 digits to show delta hp only');
            return;
        }

        const unit = this;
        const {attr, gameAttr} = unit;
        const {square} = mapGuide.size;
        const negativeTint = 0xCC0000;
        const isPositive = hitPointsDelta > 0;

        const sign = PIXI.Sprite.fromImage(imageMap.font.popup[isPositive ? 'plus' : 'minus']);
        const number0 = PIXI.Sprite.fromImage(imageMap.font.popup[hitPointsDeltaString[0] || 'space']);
        const number1 = PIXI.Sprite.fromImage(imageMap.font.popup[hitPointsDeltaString[1] || 'space']);

        [sign, number0, number1].forEach((sprite: PIXI.Sprite) => {
            if (isPositive) {
                return;
            }

            // eslint-disable-next-line no-param-reassign
            sprite.tint = negativeTint;
        });

        if (hitPointsDeltaString.length === 1) {
            sign.position.set(square / 6, 0);
            number0.position.set(square / 6 + square / 3, 0);
            number1.position.set(0, 0);
        } else {
            sign.position.set(0, 0);
            number0.position.set(square / 3, 0);
            number1.position.set(square / 3 * 2, 0);
        }

        const hitPointsContainer = new PIXI.Container();

        hitPointsContainer.addChild(sign);
        hitPointsContainer.addChild(number0);
        hitPointsContainer.addChild(number1);
        gameAttr.container.addChild(hitPointsContainer);

        hitPointsContainer.alpha = 0;

        const animationFrom: LevelUpAnimationDataType = {
            x: 0,
            y: square,
            alpha: 0
        };

        const animationShow: LevelUpAnimationDataType = {
            x: 0,
            y: -square / 12,
            alpha: 1
        };

        const animationTo: LevelUpAnimationDataType = {
            x: 0,
            y: -square / 12,
            alpha: 0
        };

        await tweenList(
            [animationFrom, animationShow, animationShow, animationTo],
            defaultUnitData.animation.deltaHitPoints,
            (animationCurrent: LevelUpAnimationDataType) => {
                hitPointsContainer.position.set(animationCurrent.x, animationCurrent.y);
                hitPointsContainer.alpha = animationCurrent.alpha;
            }
        );

        gameAttr.container.removeChild(hitPointsContainer);
    }

    setIsActionAvailable(isActionAvailable: boolean) {
        const unit = this;
        const {attr, gameAttr} = unit;

        // gameAttr.isActionAvailable = isActionAvailable;

        const animationSprite = gameAttr.sprite.unit;

        animationSprite.alpha = isActionAvailable ? 1 : 0.8;

        if (!isActionAvailable) {
            animationSprite.textures[0] = PIXI.Texture.fromImage(imageMap.unit[unit.attr.type + '-gray-0']);
            animationSprite.textures[1] = PIXI.Texture.fromImage(imageMap.unit[unit.attr.type + '-gray-1']);
            return;
        }

        if (isString(attr.userId)) {
            const userColor = getUserColor(attr.userId, gameAttr.userList);

            if (isString(userColor)) {
                animationSprite.textures[0] = PIXI.Texture.fromImage(
                    imageMap.unit[unit.attr.type + '-' + userColor + '-0']
                );
                animationSprite.textures[1] = PIXI.Texture.fromImage(
                    imageMap.unit[unit.attr.type + '-' + userColor + '-1']
                );
            }
        }
    }

    /*
    getIsActionAvailable(): boolean {
        const unit = this;
        const {gameAttr} = unit;

        return gameAttr.isActionAvailable;
    }
    */

    getGuideData(): UnitGuideDataType {
        const unit = this;
        const {attr} = unit;
        const {type} = attr;

        return unitGuide[type];
    }

    hasWispAura(): boolean {
        const unit = this;

        return unit.gameAttr.hasWispAura;
    }

    refreshWispAura(gameData: GameDataType): boolean {
        const unit = this;
        const {square} = mapGuide.size;
        const unitUserId = isString(unit.attr.userId) ? unit.attr.userId : null;

        if (unitUserId === null) {
            console.error('unit has no userId', unit);
            return false;
        }

        if (unit.attr.type === 'wisp') {
            return false;
        }

        const friendWispList = gameData.unitList.filter(
            (unitInList: Unit): boolean => {
                return unitInList.attr.type === 'wisp' && unitInList.attr.userId === unitUserId;
            }
        );

        const wispAuraMap: Array<[number, number]> = [];

        friendWispList.forEach((unitWisp: Unit) => {
            const wispAuraCoordinates = getPath(
                unitWisp.attr.x,
                unitWisp.attr.y,
                unitWisp.getGuideData().auraRange || 0,
                gameData.pathMap.fly,
                []
            );

            wispAuraCoordinates.forEach((mapPoint: [number, number]) => {
                const isAlreadyInWispAuraMap = wispAuraMap.some(
                    (wispAuraMapPoint: [number, number]): boolean => {
                        return wispAuraMapPoint[0] === mapPoint[0] && wispAuraMapPoint[1] === mapPoint[1];
                    }
                );

                if (isAlreadyInWispAuraMap) {
                    // console.log('already in wispAuraMap');
                    return;
                }

                wispAuraMap.push(mapPoint);
            });
        });

        const hasWispAura = wispAuraMap.some(
            (mapPoint: [number, number]): boolean => {
                return unit.attr.x === mapPoint[0] && unit.attr.y === mapPoint[1];
            }
        );

        unit.gameAttr.hasWispAura = hasWispAura;

        unit.gameAttr.sprite.wispAura.position.set(square / 2, 0);

        if (hasWispAura) {
            unit.gameAttr.container.addChild(unit.gameAttr.sprite.wispAura);
        } else {
            unit.gameAttr.container.removeChild(unit.gameAttr.sprite.wispAura);
        }

        return hasWispAura;
    }

    getMoviePath(
        unitAction: UnitActionMoveType,
        actionsList: UnitActionsMapType,
        gameData?: GameDataType
    ): PathType | null {
        return getMoviePath(unitAction, actionsList);
    }

    canAttack(defender: Unit): boolean {
        const aggressor = this;
        const range = aggressor.getGuideData().attack.range;

        return Math.abs(defender.attr.x - aggressor.attr.x) + Math.abs(defender.attr.y - aggressor.attr.y) <= range;
    }

    destroy() {
        console.warn('implement unit destroy method for unit!!!!');
    }
}
