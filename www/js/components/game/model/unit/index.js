// @flow

import * as PIXI from 'pixi.js';
import type {MapType, UnitType, UnitActionStateType} from '../../../../maps/type';
import type {ServerUserType} from '../../../../module/server-api';
import {getUserColor, getAttackResult} from './../helper';
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

export type RefreshUnitListType = {|
    type: 'refresh-unit-list',
    map: MapType,
    activeUserId: string
|};

export type UnitActionType = UnitActionMoveType
    | UnitActionAttackType
    | RefreshUnitListType
    | UnitActionFixBuildingType;

export type UnitActionsMapType = Array<Array<Array<UnitActionType>>>;

type UnitAttrType = UnitType;

type UnitGameAttrType = {|
    container: PIXI.Container,
    sprite: {|
        unit: PIXI.extras.AnimatedSprite,
        hitPoints: PIXI.Text
    |},
    userList: Array<ServerUserType>,
    event: {|
        click: (unit: Unit) => void // eslint-disable-line no-use-before-define
    |}
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
            console.warn('---> unitData has NO .userId or/and .id', unitData);
        }

        unit.attr = JSON.parse(JSON.stringify(unitData));

        unit.gameAttr = {
            container: new PIXI.Container(),
            sprite: {
                unit: new PIXI.extras.AnimatedSprite([
                    PIXI.Texture.fromImage(imageMap.unit[unit.attr.type + '-gray-0']),
                    PIXI.Texture.fromImage(imageMap.unit[unit.attr.type + '-gray-1'])
                ]),
                hitPoints: new PIXI.Text('', textStyle)
            },
            userList: JSON.parse(JSON.stringify(unitConstructor.userList)),
            event: {
                click: unitConstructor.event.click
            }
        };

        unit.initializeUnitSprite();
        unit.initializeHitPointsSprite();
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

        gameAttr.sprite.unit.animationSpeed = 0.08;

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

    getActions(gameData: GameDataType): UnitActionsMapType | null { // eslint-disable-line complexity
        const unit = this; // eslint-disable-line consistent-this
        const actionMap: UnitActionsMapType = JSON.parse(JSON.stringify(gameData.emptyActionMap));

        if (unit.getDidAttack() ||
            unit.getDidFixBuilding() ||
            unit.getDidOccupyBuilding() ||
            unit.getDidDestroyBuilding() ||
            unit.getDidRaiseSkeleton()) {
            return null;
        }

        if (!unit.getDidMove()) {
            const actionMapMove = unit.getMoveActions(gameData);

            // add attack
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
                    actionMap[yCell][xCell][0] = cellAction[0];
                }
            });
        });

        // add fix building
        const actionMapFixBuilding = unit.getFixBuildingActions(gameData);

        actionMapFixBuilding.forEach((lineAction: Array<Array<UnitActionType>>, yCell: number) => {
            lineAction.forEach((cellAction: Array<UnitActionType>, xCell: number) => {
                if (cellAction[0]) {
                    actionMap[yCell][xCell][0] = cellAction[0];
                }
            });
        });

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

        unitContainer.on('click', () => {
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

    getGuideData(): UnitGuideDataType {
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const {type} = attr;

        return unitGuide[type];
    }

    hasWispAura(): boolean {
        return false;
    }

    destroy() {
        console.warn('implement unit destroy method for unit!!!!');
    }
}
