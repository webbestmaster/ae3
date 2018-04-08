// @flow

import * as PIXI from 'pixi.js';
import type {MapType, UnitType, UnitActionStateType} from '../../../../maps/type';
import type {ServerUserType} from '../../../../module/server-api';
import {getUserColor, getAttackResult, getEventName, getMoviePath} from './../helper';
import type {AttackResultUnitType} from './../helper';
import mapGuide from './../../../../maps/map-guide';
import unitGuide, {defaultUnitData} from './unit-guide';
import type {UnitGuideDataType} from './unit-guide';
import imageMap from './../../image/image-map';
import Building from '../building';
import {getPath} from './path-master';
import type {AvailablePathMapType} from './path-master';
import type {PathType, PointType} from './../../../../lib/a-star-finder';
import {tweenList} from './../../../../lib/tween';
import find from 'lodash/find';
import Grave from './../grave';
// import {getAttackResult} from './../helper';

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

export type UnitActionType = UnitActionMoveType
    | UnitActionAttackType
    | RefreshUnitListType
    | UnitActionFixBuildingType
    | UnitActionOccupyBuildingType
    | UnitActionRaiseSkeletonType
    | UnitActionDestroyBuildingType;

export type UnitActionsMapType = Array<Array<Array<UnitActionType>>>;

type UnitAttrType = UnitType;

type UnitGameAttrType = {|
    container: PIXI.Container,
    sprite: {|
        unit: PIXI.extras.AnimatedSprite,
        hitPoints: PIXI.Text,
        poisonCountdown: PIXI.Text,
        wispAura: PIXI.Sprite
    |},
    userList: Array<ServerUserType>,
    event: {|
        click: (unit: Unit) => void // eslint-disable-line no-use-before-define
    |},
    hasWispAura: boolean,
    isActionAvailable: boolean
|};

export type UnitConstructorType = {|
    unitData: UnitType,
    userList: Array<ServerUserType>,
    event: {|
        click: (unit: Unit) => void // eslint-disable-line no-use-before-define
    |}
|};

export type GameDataType = {|
    +userList: Array<ServerUserType>;
    +buildingList: Array<Building>;
    +unitList: Array<Unit>; // eslint-disable-line no-use-before-define
    +graveList: Array<Grave>; // eslint-disable-line no-use-before-define
    +pathMap: {
        +walk: Array<Array<number>>,
        +flow: Array<Array<number>>,
        +fly: Array<Array<number>>
    };
    +armorMap: {
        +walk: Array<Array<number>>,
        +flow: Array<Array<number>>,
        +fly: Array<Array<number>>
    };
    +emptyActionMap: Array<Array<[]>>
|};

const textStyle = new PIXI.TextStyle({
    fontFamily: 'monospace',
    fill: '#cccc00',
    fontSize: 8,
    stroke: '#000000',
    strokeThickness: 4
});

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
        const unit = this; // eslint-disable-line consistent-this

        unit.initialize(unitConstructor);

        return unit;
    }

    initialize(unitConstructor: UnitConstructorType) {
        const unit = this; // eslint-disable-line consistent-this
        const {unitData} = unitConstructor;

        if (typeof unitData.userId !== 'string' || typeof unitData.id !== 'string') {
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
                hitPoints: new PIXI.Text('', textStyle),
                poisonCountdown: new PIXI.Text('', textStyleRed),
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
        unit.initializePoisonCountdownSprite();
        unit.bindUnitEventListeners();
    }

    initializeUnitSprite() { // eslint-disable-line complexity
        const unit = this; // eslint-disable-line consistent-this
        const {attr, gameAttr} = unit;
        const {square} = mapGuide.size;

        let color = 'gray';

        gameAttr.container.position.set(attr.x * square, attr.y * square);

        if (typeof attr.userId === 'string') {
            const userColor = getUserColor(attr.userId, gameAttr.userList);

            if (typeof userColor === 'string') {
                color = userColor;
            }
        }

        gameAttr.sprite.unit = new PIXI.extras.AnimatedSprite([
            PIXI.Texture.fromImage(imageMap.unit[attr.type + '-' + color + '-0']),
            PIXI.Texture.fromImage(imageMap.unit[attr.type + '-' + color + '-1'])
        ]);

        gameAttr.sprite.unit.animationSpeed = defaultUnitData.render.spriteAnimatedSpeed;

        gameAttr.sprite.unit.play();
        // attr.sprite.unit = PIXI.Sprite.fromImage(imageMap.unit[attr.type + '-' + color + '-0']);

        gameAttr.container.addChild(gameAttr.sprite.unit);
    }

    initializeHitPointsSprite() {
        const unit = this; // eslint-disable-line consistent-this
        const {attr, gameAttr} = unit;
        const hitPoints = unit.getHitPoints();

        if (hitPoints !== defaultUnitData.hitPoints) {
            unit.setHitPoints(hitPoints);
        }

        if (hitPoints > defaultUnitData.hitPoints) {
            console.error('hitPoints bigger than default hitPoints!', unit);
        }

        gameAttr.container.addChild(gameAttr.sprite.hitPoints);
    }

    initializePoisonCountdownSprite() {
        const unit = this; // eslint-disable-line consistent-this
        const {attr, gameAttr} = unit;
        const poisonCountdown = unit.getPoisonCountdown();
        const {square} = mapGuide.size;


        // if (poisonCountdown !== defaultUnitData.poisonCountdown) {
        if (typeof attr.poisonCountdown === 'number') {
            unit.setPoisonCountdown(poisonCountdown);
        }
        // }

        /*
                if (hitPoints > defaultUnitData.hitPoints) {
                    console.error('hitPoints bigger than default hitPoints!', unit);
                }
        */

        gameAttr.sprite.poisonCountdown.position.set(square * 0.75, 0);

        gameAttr.container.addChild(gameAttr.sprite.poisonCountdown);
    }

    getActions(gameData: GameDataType): UnitActionsMapType | null { // eslint-disable-line complexity, max-statements
        const unit = this; // eslint-disable-line consistent-this

        if (unit.getDidAttack() ||
            unit.getDidFixBuilding() ||
            unit.getDidOccupyBuilding() ||
            unit.getDidDestroyBuilding() ||
            unit.getDidRaiseSkeleton()) {
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

            actionMapMove.forEach((lineAction: Array<Array<UnitActionType>>, yCell: number) => {
                lineAction.forEach((cellAction: Array<UnitActionType>, xCell: number) => {
                    // actionMap[yCell][xCell].push(...cellAction);
                    if (cellAction[0]) {
                        actionMap[yCell][xCell][0] = cellAction[0];
                    }
                });
            });
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


        if (isDidMoved &&
            !isAvailableAttack &&
            !isAvailableFixBuilding &&
            !isAvailableOccupyBuilding &&
            !isAvailableDestroyBuilding &&
            !isAvailableRaiseSkeleton) {
            return null;
        }

        return actionMap;
    }

    getMoveActions(gameData: GameDataType): UnitActionsMapType {
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const moveMap: UnitActionsMapType = JSON.parse(JSON.stringify(gameData.emptyActionMap));
        const unitId = typeof attr.id === 'string' ? attr.id : null;

        if (unitId === null) {
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
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const attackMap: UnitActionsMapType = JSON.parse(JSON.stringify(gameData.emptyActionMap));
        const unitId = typeof attr.id === 'string' ? attr.id : null;

        if (unitId === null) {
            console.error('unit has no id', unit);
            return attackMap;
        }

        const attackMapPointList = unit.getAvailableAttack(gameData);

        // get attack fields
        attackMapPointList.forEach((cell: [number, number]) => {
            const defender = find(gameData.unitList, (unitInList: Unit): boolean => {
                return unitInList.attr.x === cell[0] && unitInList.attr.y === cell[1];
            }) || null;

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

    getFixBuildingActions(gameData: GameDataType): UnitActionsMapType { // eslint-disable-line complexity, max-statements
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const fixBuildingMap: UnitActionsMapType = JSON.parse(JSON.stringify(gameData.emptyActionMap));
        const unitId = typeof attr.id === 'string' ? attr.id : null;
        const userId = typeof attr.userId === 'string' ? attr.userId : null;

        if (unitId === null) {
            console.error('unit has no id', unit);
            return fixBuildingMap;
        }

        if (userId === null) {
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

        const building = find(gameData.buildingList, (buildingInList: Building): boolean => {
            return buildingInList.attr.type === 'farm-destroyed' &&
                buildingInList.attr.x === unitX &&
                buildingInList.attr.y === unitY;
        }) || null;

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

    getOccupyBuildingActions(gameData: GameDataType): UnitActionsMapType { // eslint-disable-line complexity, max-statements
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const occupyBuildingMap: UnitActionsMapType = JSON.parse(JSON.stringify(gameData.emptyActionMap));
        const unitId = typeof attr.id === 'string' ? attr.id : null;
        const userId = typeof attr.userId === 'string' ? attr.userId : null;

        if (unitId === null) {
            console.error('unit has no id', unit);
            return occupyBuildingMap;
        }

        if (userId === null) {
            console.error('unit has no userId', unit);
            return occupyBuildingMap;
        }

        const unitGuideData = unit.getGuideData();

        if (!(unitGuideData.occupyBuildingList instanceof Array)) {
            console.log('unit can not occupy building');
            return [];
        }

        // find building for occupy
        const unitX = attr.x;
        const unitY = attr.y;

        const building = find(gameData.buildingList, (buildingInList: Building): boolean => {
            return buildingInList.attr.x === unitX &&
                buildingInList.attr.y === unitY &&
                buildingInList.attr.userId !== userId &&
                unitGuideData.occupyBuildingList instanceof Array &&
                unitGuideData.occupyBuildingList.includes(buildingInList.attr.type);
        }) || null;

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

    getDestroyBuildingActions(gameData: GameDataType): UnitActionsMapType { // eslint-disable-line complexity, max-statements
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const destroyBuildingMap: UnitActionsMapType = JSON.parse(JSON.stringify(gameData.emptyActionMap));
        const unitId = typeof attr.id === 'string' ? attr.id : null;
        const userId = typeof attr.userId === 'string' ? attr.userId : null;

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
            const building = find(gameData.buildingList, (buildingInList: Building): boolean => {
                return destroyBuildingList.includes(buildingInList.attr.type) &&
                    typeof buildingInList.attr.userId === 'string' &&
                    buildingInList.attr.userId !== userId &&
                    buildingInList.attr.x === cell[0] &&
                    buildingInList.attr.y === cell[1];
            }) || null;

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
                    id: typeof building.attr.id === 'string' ? building.attr.id : 'no-building-id-' + Math.random()
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

    getRaiseSkeletonActions(gameData: GameDataType): UnitActionsMapType { // eslint-disable-line complexity, max-statements
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const raiseSkeletonMap: UnitActionsMapType = JSON.parse(JSON.stringify(gameData.emptyActionMap));
        const unitId = typeof attr.id === 'string' ? attr.id : null;
        const userId = typeof attr.userId === 'string' ? attr.userId : null;

        if (unitId === null) {
            console.error('unit has no id', unit);
            return raiseSkeletonMap;
        }

        if (userId === null) {
            console.error('unit has no userId', unit);
            return raiseSkeletonMap;
        }

        const unitGuideData = unit.getGuideData();

        if (typeof unitGuideData.raiseSkeletonRange !== 'number') {
            console.log('unit can not raise skeleton');
            return raiseSkeletonMap;
        }

        const raiseSkeletonMapPointList = getPath(
            unit.attr.x,
            unit.attr.y,
            unitGuideData.raiseSkeletonRange,
            gameData.pathMap.fly,
            []);

        // get attack fields
        raiseSkeletonMapPointList.forEach((cell: [number, number]) => {
            const grave = find(gameData.graveList, (graveInList: Grave): boolean => {
                return graveInList.attr.x === cell[0] && graveInList.attr.y === cell[1];
            }) || null;

            if (grave === null) {
                console.log('No grave by coordinates:', cell);
                return;
            }

            // check unit on grave
            const unitOnGrave = find(gameData.unitList, (unitInList: Unit): boolean => {
                return unitInList.attr.x === grave.attr.x && unitInList.attr.y === grave.attr.y;
            }) || null;

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
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const {unitList} = gameData;
        const userId = typeof attr.userId === 'string' ? attr.userId : null;

        if (userId === null) {
            console.error('unit has no user id', unit);
            return [];
        }

        return unitList
            .filter((unitInList: Unit): boolean => {
                return unitInList.attr.userId !== userId;
            })
            .map((unitInList: Unit): [number, number] => [unitInList.attr.x, unitInList.attr.y]);
    }

    getAvailablePath(gameData: GameDataType): AvailablePathMapType {
        console.warn('---> reduce path if unit poisoned!');
        const unit = this; // eslint-disable-line consistent-this
        const {x, y, type} = unit.attr;

        if (!unitGuide.hasOwnProperty(type)) {
            console.error('unitGuide has no property:', type, unit);
            return [];
        }

        const unitGuideData = unitGuide[type];

        const moveType = typeof unitGuideData.moveType === 'string' ?
            unitGuideData.moveType :
            null;

        const pathMap = moveType === null ? gameData.pathMap.walk : gameData.pathMap[moveType];

        return getPath(x, y, unitGuideData.move, pathMap, unit.getAllUnitsCoordinates(gameData));
    }

    getAvailableAttack(gameData: GameDataType): AvailablePathMapType {
        const unit = this; // eslint-disable-line consistent-this
        const {x, y, type} = unit.attr;

        if (!unitGuide.hasOwnProperty(type)) {
            console.error('unitGuide has no property:', type, unit);
            return [];
        }

        const enemyUnitCoordinates = unit.getAllEnemyUnitsCoordinates(gameData);
        const allAvailableAttack = unit.getAllAvailableAttack(gameData).filter((mapPoint: PointType): boolean => {
            return enemyUnitCoordinates.some((unitCoordinates: [number, number]): boolean => {
                return unitCoordinates[0] === mapPoint[0] && unitCoordinates[1] === mapPoint[1];
            });
        });

        return allAvailableAttack;
    }

    getAllAvailableAttack(gameData: GameDataType): AvailablePathMapType {
        const unit = this; // eslint-disable-line consistent-this
        const {x, y, type} = unit.attr;

        if (!unitGuide.hasOwnProperty(type)) {
            console.error('unitGuide has no property:', type, unit);
            return [];
        }

        const unitGuideData = unitGuide[type];

        return getPath(x, y, unitGuideData.attack.range, gameData.pathMap.fly, []);
    }

    bindUnitEventListeners() { // eslint-disable-line complexity
        const unit = this; // eslint-disable-line consistent-this
        const {attr, gameAttr} = unit;
        const {square} = mapGuide.size;

        const unitContainer = unit.gameAttr.container;

        unitContainer.interactive = true;
        unitContainer.buttonMode = true;

        unitContainer.on(getEventName('click'), () => {
            console.log('click on unit', unit);
            unit.gameAttr.event.click(unit);
        });
    }

    move(x: number, y: number, movePath: PathType): Promise<void> {
        const unit = this; // eslint-disable-line consistent-this
        const {attr, gameAttr} = unit;
        const {square} = mapGuide.size;

        attr.x = x;
        attr.y = y;

        unit.setDidMove(true);

        return tweenList(movePath, 100, (pathPoint: PointType) => {
            gameAttr.container.position.set(pathPoint[0] * square, pathPoint[1] * square);
        })
            .then(() => {
            });
    }

    async setActionState(actionState: UnitActionStateType | null): Promise<void> { // eslint-disable-line complexity
        const unit = this; // eslint-disable-line consistent-this
        const currentActionState = unit.attr.action || null;

        if (actionState === null && currentActionState === null) {
            console.log('old and new action state is null');
            return Promise.resolve();
        }

        if (actionState === null && currentActionState !== null) {
            console.error('old action state !==  null, but new action state === null!!!, ' +
                'the game has not method to remove unit\'s action');
            return Promise.resolve();
        }

        if (actionState === null) {
            console.log('action state did not passed');
            return Promise.resolve();
        }

        const promiseList = [];

        Object.keys(actionState).forEach((actionName: string) => { // eslint-disable-line max-statements, complexity
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
                case 'didMove': {
                    console.log('setDidMove', actionState[actionName]);
                    unit.setDidMove(Boolean(actionState[actionName]));
                    return;
                }
                case 'didAttack': {
                    console.log('setDidAttack', actionState[actionName]);
                    unit.setDidAttack(Boolean(actionState[actionName]));
                    return;
                }
                case 'didFixBuilding': {
                    console.log('didFixBuilding', actionState[actionName]);
                    unit.setDidFixBuilding(Boolean(actionState[actionName]));
                    return;
                }
                case 'didOccupyBuilding': {
                    console.log('didOccupyBuilding', actionState[actionName]);
                    unit.setDidOccupyBuilding(Boolean(actionState[actionName]));
                    return;
                }
                case 'didRaiseSkeleton': {
                    console.log('didRaiseSkeleton', actionState[actionName]);
                    unit.setDidRaiseSkeleton(Boolean(actionState[actionName]));
                    return;
                }
                case 'didDestroyBuilding': {
                    console.log('didDestroyBuilding', actionState[actionName]);
                    unit.setDidDestroyBuilding(Boolean(actionState[actionName]));
                    return;
                }

                default:
                    console.error('unsupported action name', actionName, actionState);
            }
        });

        return Promise.all(promiseList)
            .then(() => {
            });
    }

    setDidMove(didMove: boolean) {
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        unitActionState.didMove = didMove;
        attr.action = unitActionState;
    }

    getDidMove(): boolean {
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        return Boolean(unitActionState.didMove);
    }

    setDidAttack(didAttack: boolean) {
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        unitActionState.didAttack = didAttack;
        attr.action = unitActionState;
    }

    getDidAttack(): boolean {
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        return Boolean(unitActionState.didAttack);
    }

    setDidFixBuilding(didFixBuilding: boolean) {
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        unitActionState.didFixBuilding = didFixBuilding;
        attr.action = unitActionState;
    }

    getDidFixBuilding(): boolean {
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        return Boolean(unitActionState.didFixBuilding);
    }

    setDidOccupyBuilding(didOccupyBuilding: boolean) {
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        unitActionState.didOccupyBuilding = didOccupyBuilding;
        attr.action = unitActionState;
    }

    getDidOccupyBuilding(): boolean {
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        return Boolean(unitActionState.didOccupyBuilding);
    }

    setDidDestroyBuilding(didDestroyBuilding: boolean) {
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        unitActionState.didDestroyBuilding = didDestroyBuilding;
        attr.action = unitActionState;
    }

    getDidDestroyBuilding(): boolean {
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        return Boolean(unitActionState.didDestroyBuilding);
    }

    setDidRaiseSkeleton(didRaiseSkeleton: boolean) {
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        unitActionState.didRaiseSkeleton = didRaiseSkeleton;
        attr.action = unitActionState;
    }

    getDidRaiseSkeleton(): boolean {
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        return Boolean(unitActionState.didRaiseSkeleton);
    }

    setDamageGiven(damageGiven: number) {
        const unit = this; // eslint-disable-line consistent-this

        unit.attr.damage = unit.attr.damage || {};

        unit.attr.damage.given = damageGiven;
    }

    setDamageGivenUpdateBy(damageGivenDelta: number) {
        const unit = this; // eslint-disable-line consistent-this

        unit.setDamageGiven(unit.getDamageGiven() + damageGivenDelta);
    }

    getDamageGiven(): number {
        const unit = this; // eslint-disable-line consistent-this
        const {damage} = unit.attr;

        return damage && typeof damage.given === 'number' ? damage.given : 0;
    }


    setDamageReceived(damageReceived: number) {
        const unit = this; // eslint-disable-line consistent-this

        unit.attr.damage = unit.attr.damage || {};

        unit.attr.damage.received = damageReceived;
    }

    setDamageReceivedUpdateBy(damageReceivedDelta: number) {
        const unit = this; // eslint-disable-line consistent-this

        unit.setDamageReceived(unit.getDamageReceived() + damageReceivedDelta);
    }

    getDamageReceived(): number {
        const unit = this; // eslint-disable-line consistent-this
        const {damage} = unit.attr;

        return damage && typeof damage.received === 'number' ? damage.received : 0;
    }

    setPoisonCountdown(poisonCountdown: number) {
        const unit = this; // eslint-disable-line consistent-this
        const {attr, gameAttr} = unit;

        attr.poisonCountdown = poisonCountdown;

        gameAttr.sprite.poisonCountdown.text = poisonCountdown === defaultUnitData.poisonCountdown ?
            '' :
            poisonCountdown;
    }

    decreasePoisonCountdown() {
        const unit = this; // eslint-disable-line consistent-this

        const poisonCountdown = unit.getPoisonCountdown();

        if (poisonCountdown === 0) {
            return;
        }

        unit.setPoisonCountdown(poisonCountdown - 1);
    }

    getPoisonCountdown(): number {
        const unit = this; // eslint-disable-line consistent-this

        return typeof unit.attr.poisonCountdown === 'number' ?
            unit.attr.poisonCountdown :
            defaultUnitData.poisonCountdown;
    }


    hasId(): boolean {
        const unit = this; // eslint-disable-line consistent-this

        return typeof unit.attr.id === 'string' && unit.attr.id.length > 0;
    }

    getId(): string | null {
        const unit = this; // eslint-disable-line consistent-this

        if (typeof unit.attr.id === 'string' && unit.attr.id.length > 0) {
            return unit.attr.id;
        }

        console.error('unit has no id', unit);

        return null;
    }

    hasUserId(): boolean {
        const unit = this; // eslint-disable-line consistent-this

        return typeof unit.attr.userId === 'string' && unit.attr.userId.length > 0;
    }

    getUserId(): string | null {
        const unit = this; // eslint-disable-line consistent-this

        if (typeof unit.attr.userId === 'string' && unit.attr.userId.length > 0) {
            return unit.attr.userId;
        }

        console.error('unit has no userId', unit);

        return null;
    }

    setLevel(level: number) {
        const unit = this; // eslint-disable-line consistent-this

        unit.attr.level = level;
    }

    getLevel(): number {
        const unit = this; // eslint-disable-line consistent-this

        return typeof unit.attr.level === 'number' ? unit.attr.level : defaultUnitData.level;
    }

    getPoisonAttack(): number {
        const unit = this; // eslint-disable-line consistent-this
        const guideData = unit.getGuideData();

        return typeof guideData.poisonAttack === 'number' ? guideData.poisonAttack : 0;
    }

    /*
    set___(___: boolean) {
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        unitActionState.___ = ___;
        attr.action = unitActionState;
    }

    get___(): boolean {
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const unitActionState = attr.hasOwnProperty('action') && attr.action ? attr.action : {};

        return Boolean(unitActionState.___);
    }
    */

    setHitPoints(hitPoints: number) {
        const unit = this; // eslint-disable-line consistent-this
        const {attr, gameAttr} = unit;

        if (hitPoints > defaultUnitData.hitPoints) {
            console.error('too many hitPoints', hitPoints, unit);
            unit.setHitPoints(defaultUnitData.hitPoints);
            return;
        }

        if (hitPoints === 0) {
            console.error('hitPoints is 0, remove from Game unit and create a grave', unit);
            return;
        }

        attr.hitPoints = hitPoints;
        gameAttr.sprite.hitPoints.text = hitPoints === defaultUnitData.hitPoints ? '' : hitPoints;
    }

    getHitPoints(): number {
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;

        if (typeof attr.hitPoints === 'number') {
            return attr.hitPoints;
        }
        return defaultUnitData.hitPoints;
    }

    setIsActionAvailable(isActionAvailable: boolean) {
        const unit = this; // eslint-disable-line consistent-this
        const {gameAttr} = unit;

        gameAttr.isActionAvailable = isActionAvailable;

        gameAttr.container.alpha = isActionAvailable ? 1 : 0.5;
    }

    getIsActionAvailable(): boolean {
        const unit = this; // eslint-disable-line consistent-this
        const {gameAttr} = unit;

        return gameAttr.isActionAvailable;
    }

    getGuideData(): UnitGuideDataType {
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const {type} = attr;

        return unitGuide[type];
    }

    hasWispAura(): boolean {
        const unit = this; // eslint-disable-line consistent-this

        return unit.gameAttr.hasWispAura;
    }

    refreshWispAura(gameData: GameDataType): boolean {
        const unit = this; // eslint-disable-line consistent-this
        const {square} = mapGuide.size;
        const unitUserId = typeof unit.attr.userId === 'string' ? unit.attr.userId : null;

        if (unitUserId === null) {
            console.error('unit has no userId', unit);
            return false;
        }

        if (unit.attr.type === 'wisp') {
            return false;
        }

        const friendWispList = gameData.unitList.filter((unitInList: Unit): boolean => {
            return unitInList.attr.type === 'wisp' && unitInList.attr.userId === unitUserId;
        });

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
                const isAlreadyInWispAuraMap = wispAuraMap.some((wispAuraMapPoint: [number, number]): boolean => {
                    return wispAuraMapPoint[0] === mapPoint[0] && wispAuraMapPoint[1] === mapPoint[1];
                });

                if (isAlreadyInWispAuraMap) {
                    console.log('already in wispAuraMap');
                    return;
                }

                wispAuraMap.push(mapPoint);
            });
        });

        const hasWispAura = wispAuraMap.some((mapPoint: [number, number]): boolean => {
            return unit.attr.x === mapPoint[0] && unit.attr.y === mapPoint[1];
        });

        unit.gameAttr.hasWispAura = hasWispAura;

        unit.gameAttr.sprite.wispAura.position.set(square / 2, 0);

        if (hasWispAura) {
            unit.gameAttr.container.addChild(unit.gameAttr.sprite.wispAura);
        } else {
            unit.gameAttr.container.removeChild(unit.gameAttr.sprite.wispAura);
        }

        return hasWispAura;
    }

    getMoviePath(unitAction: UnitActionMoveType,
                 actionsList: UnitActionsMapType,
                 gameData?: GameDataType): PathType | null {
        return getMoviePath(unitAction, actionsList);
    }

    canAttack(defender: Unit): boolean {
        const aggressor = this; // eslint-disable-line consistent-this
        const range = aggressor.getGuideData().attack.range;

        return Math.abs(defender.attr.x - aggressor.attr.x) + Math.abs(defender.attr.y - aggressor.attr.y) <= range;
    }

    destroy() {
        console.warn('implement unit destroy method for unit!!!!');
    }
}
