// @flow
/* global document, window */

import type {TeamIdType} from './../../../maps/map-guide';
import mapGuide from './../../../maps/map-guide';
import type {UnitTypeAllType, UnitTypeCommanderType} from './unit/unit-guide';
import unitGuideData, {additionalUnitData, defaultUnitData} from './unit/unit-guide';
import type {GameDataType, UnitActionMoveType, UnitActionsMapType, UnitActionType} from './unit';
import Unit from './unit';
import type {PathType} from './../../../lib/a-star-finder';
import {defaultOptions, getPath} from './../../../lib/a-star-finder';
import type {MapType, UnitType} from './../../../maps/type';
import find from 'lodash/find';
import type {BuildingType, MapUserType} from '../../../maps/type';
import * as PIXI from 'pixi.js';
import {storeViewId} from './../../store';
import queryString from 'query-string';

type InteractionEventType = {|
    +data: {|
        +global: {|
            +x: number,
            +y: number
        |},
        +originalEvent: {|
            touches?: Array<{|
                +x: number,
                +y: number
            |}>
        |}
    |}
|};

export function getUserIndex(userId: string, userList: Array<MapUserType>): number | null {
    let userIndex = 0;
    const maxIndex = 4;

    while (userList[userIndex] && userList[userIndex].userId !== userId && userIndex < maxIndex) {
        userIndex += 1;
    }

    if (userIndex === maxIndex) {
        return null;
    }

    return userIndex;
}

export function getUserColor(userId: string, userList: Array<MapUserType>): string | null {
    const userIndex = getUserIndex(userId, userList);

    if (userIndex === null) {
        return null;
    }

    return mapGuide.colorList[userIndex] || null;
}

function unitActionMapToPathMap(actionsList: UnitActionsMapType): Array<string> {
    const noPath = typeof defaultOptions.noPath === 'string' ? defaultOptions.noPath : null;

    if (noPath === null) {
        console.error('noPath is not defined');
        return [];
    }

    return actionsList
        .map((unitActionLine: Array<Array<UnitActionType>>): Array<string> => {
            return unitActionLine.map((unitActionList: Array<UnitActionType>): string => {
                const hasMoveType = unitActionList.some((unitAction: UnitActionType): boolean => {
                    return unitAction.type === 'move';
                });

                return hasMoveType ? '.' : noPath;
            });
        })
        .map((mapLine: Array<string>): string => mapLine.join(''));
}

export function getMoviePath(unitAction: UnitActionMoveType, actionsList: UnitActionsMapType): PathType | null {
    const unitPathMap = unitActionMapToPathMap(actionsList);

    return getPath(unitPathMap, [unitAction.from.x, unitAction.from.y], [unitAction.to.x, unitAction.to.y]);
}

export type UnitDataForAttackType = {|
    +attack: {|
        +min: number,
        +max: number,
        +range: number
    |},
    +poisonAttack: number,
    +type: UnitTypeAllType,
    +id: string,
    +userId: string,
    +armor: number,
    +x: number,
    +y: number,
    +canAttack: boolean,
    hitPoints: number, // will rewrite in getAttackDamage
    poisonCountdown: number,
    +hasWispAura: boolean,
    +damage: {| // need to count level
        given: number, // will rewrite in getAttackDamage
        received: number // will rewrite in getAttackDamage
    |},
    +level: number,
    +placeArmor: number
|};

export type AttackResultUnitType = UnitDataForAttackType;

export type AttackResultType = {|
    aggressor: AttackResultUnitType,
    defender: AttackResultUnitType
|};

export function getAttackResult(gameData: GameDataType, aggressor: Unit, defender: Unit): AttackResultType { // eslint-disable-line max-statements, complexity
    const unitsDataForAttack = getUnitsDataForAttack(gameData, aggressor, defender);
    const aggressorData = unitsDataForAttack.aggressor;
    const defenderData = unitsDataForAttack.defender;

    if (aggressorData.canAttack === false) {
        console.error('aggressor can not attack defender', aggressorData, defenderData);
        return {
            aggressor: aggressorData,
            defender: defenderData
        };
    }

    const resultAggressorDamage = getAttackDamage(aggressorData, defenderData);

    if (resultAggressorDamage >= defenderData.hitPoints) {
        // aggressor kill defender
        aggressorData.damage.given += defenderData.hitPoints;
        defenderData.damage.received += defenderData.hitPoints;
        defenderData.hitPoints = 0;
        return {
            aggressor: aggressorData,
            defender: defenderData
        };
    }

    aggressorData.damage.given += resultAggressorDamage;
    defenderData.damage.received += resultAggressorDamage;
    defenderData.hitPoints -= resultAggressorDamage;
    defenderData.poisonCountdown = Math.max(defenderData.poisonCountdown, aggressorData.poisonAttack);

    if (defenderData.canAttack === false) {
        console.log('defender can NOT strike back');
        return {
            aggressor: aggressorData,
            defender: defenderData
        };
    }


    const resultDefenderDamage = getAttackDamage(defenderData, aggressorData);

    if (resultDefenderDamage >= aggressorData.hitPoints) {
        // defender kill aggressor
        defenderData.damage.given += aggressorData.hitPoints;
        aggressorData.damage.received += aggressorData.hitPoints;
        aggressorData.hitPoints = 0;
        return {
            aggressor: aggressorData,
            defender: defenderData
        };
    }

    defenderData.damage.given += resultDefenderDamage;
    aggressorData.damage.received += resultDefenderDamage;
    aggressorData.hitPoints -= resultDefenderDamage;
    aggressorData.poisonCountdown = Math.max(aggressorData.poisonCountdown, defenderData.poisonAttack);

    return {
        aggressor: aggressorData,
        defender: defenderData
    };
}


type UnitsDataForAttackType = {|
    +aggressor: UnitDataForAttackType,
    +defender: UnitDataForAttackType
|};

function getAttackDamage(aggressor: UnitDataForAttackType, defender: UnitDataForAttackType): number {
    // TODO:
    // 1 - add bonus damage archer vs fly unit
    // 2 - add bonus damage wisp vs skeleton
    // 3 - add bonus damage by unit level, count unit level from damage given/received
    console.warn('getAttackDamage - 1 - add bonus damage archer vs fly unit');
    console.warn('getAttackDamage - 2 - add bonus damage wisp vs skeleton');

    const minDamage = 1;
    const aggressorScale = aggressor.hitPoints / defaultUnitData.hitPoints;
    const aggressorSelfAttack = Math.random() * (aggressor.attack.max - aggressor.attack.min) +
        aggressor.attack.min +
        // level damage
        aggressor.level / (defaultUnitData.level.max + 1) * ((aggressor.attack.max + aggressor.attack.min) / 2);
    const aggressorAttackBonusWistAura = aggressor.hasWispAura ? additionalUnitData.wispAttackBonus : 0;
    const aggressorPoisonAttackReduce = aggressor.poisonCountdown > 0 ? additionalUnitData.poisonAttackReduce : 0;
    const aggressorEndAttack = aggressorScale *
        (aggressorSelfAttack + aggressorAttackBonusWistAura - aggressorPoisonAttackReduce);

    const defenderScale = defender.hitPoints / defaultUnitData.hitPoints;
    const defenderSelfArmor = defender.armor +
        // level armor
        defender.level * defaultUnitData.armor.perLevel;
    const defenderPoisonArmorReduce = defender.poisonCountdown > 0 ? additionalUnitData.poisonArmorReduce : 0;
    const defenderPlaceArmor = defender.placeArmor;
    const defenderEndArmor = defenderScale * (defenderSelfArmor - defenderPoisonArmorReduce) + defenderPlaceArmor;

    return Math.max(Math.round(aggressorEndAttack - defenderEndArmor), minDamage);
}

function getUnitsDataForAttack(gameData: GameDataType, // eslint-disable-line complexity
                               aggressor: Unit,
                               defender: Unit): UnitsDataForAttackType {
    const aggressorGuideData = aggressor.getGuideData();

    const aggressorData: UnitDataForAttackType = {
        attack: {
            min: aggressorGuideData.attack.min,
            max: aggressorGuideData.attack.max,
            range: aggressorGuideData.attack.range
        },
        poisonAttack: aggressor.getPoisonAttack(),
        type: aggressor.attr.type,
        id: typeof aggressor.attr.id === 'string' ? aggressor.attr.id : 'no-aggressor-id-' + Math.random(),
        userId: typeof aggressor.attr.userId === 'string' ?
            aggressor.attr.userId :
            'no-aggressor-user-id-' + Math.random(),
        armor: aggressorGuideData.armor,
        x: aggressor.attr.x,
        y: aggressor.attr.y,
        canAttack: aggressor.canAttack(defender),
        hitPoints: aggressor.getHitPoints(),
        poisonCountdown: aggressor.getPoisonCountdown(),
        hasWispAura: aggressor.hasWispAura(),
        damage: {
            given: aggressor.getDamageGiven(),
            received: aggressor.getDamageReceived()
        },
        level: aggressor.getLevel(),
        placeArmor: typeof aggressorGuideData.moveType === 'string' ?
            gameData.armorMap[aggressorGuideData.moveType][aggressor.attr.y][aggressor.attr.x] :
            gameData.armorMap.walk[aggressor.attr.y][aggressor.attr.x]
    };


    const defenderGuideData = defender.getGuideData();

    const defenderData: UnitDataForAttackType = {
        attack: {
            min: defenderGuideData.attack.min,
            max: defenderGuideData.attack.max,
            range: defenderGuideData.attack.range
        },
        poisonAttack: defender.getPoisonAttack(),
        type: defender.attr.type,
        id: typeof defender.attr.id === 'string' ? defender.attr.id : 'no-defender-id-' + Math.random(),
        userId: typeof defender.attr.userId === 'string' ?
            defender.attr.userId :
            'no-defender-user-id-' + Math.random(),
        armor: defenderGuideData.armor,
        x: defender.attr.x,
        y: defender.attr.y,
        canAttack: defender.canAttack(aggressor),
        hitPoints: defender.getHitPoints(),
        poisonCountdown: defender.getPoisonCountdown(),
        hasWispAura: defender.hasWispAura(),
        damage: {
            given: defender.getDamageGiven(),
            received: defender.getDamageReceived()
        },
        level: defender.getLevel(),
        placeArmor: typeof defenderGuideData.moveType === 'string' ?
            gameData.armorMap[defenderGuideData.moveType][defender.attr.y][defender.attr.x] :
            gameData.armorMap.walk[defender.attr.y][defender.attr.x]
    };

    return {
        aggressor: aggressorData,
        defender: defenderData
    };
}

type MouseEventNameType = 'click' | 'mousedown' | 'mouseup';
type TouchEventNameType = 'tap' | 'touchstart' | 'touchend';
type EventNameMapType = { +[key: MouseEventNameType]: TouchEventNameType };

function getEventName(MouseEventName: MouseEventNameType): MouseEventNameType | TouchEventNameType {
    const eventNameMap: EventNameMapType = {
        click: 'tap',
        mousedown: 'touchstart',
        mouseup: 'touchend'
    };

    const hasInMap = typeof eventNameMap[MouseEventName] === 'string';

    // check for mobile events
    if ('ontouchstart' in document) {
        return hasInMap ? eventNameMap[MouseEventName] : 'tap';
    }

    return hasInMap ? MouseEventName : 'click';
}

function noop() {
}

export function bindClick(container: PIXI.Container, callback: () => Promise<void>, smthWrongCallback?: () => void) {
    const containerEvent = {
        startTouch: {
            x: NaN,
            y: NaN
        }
    };

    const smthWrongCallbackFunction = smthWrongCallback || noop;

    container.on(getEventName('mousedown'), (interactionEvent: InteractionEventType) => {
        containerEvent.startTouch.x = interactionEvent.data.global.x;
        containerEvent.startTouch.y = interactionEvent.data.global.y;

        const {originalEvent} = interactionEvent.data;

        // this is not fix problem, but make problem more hard reproducible
        if (Array.isArray(originalEvent.touches) && originalEvent.touches.length > 1) {
            containerEvent.startTouch.x = NaN;
            containerEvent.startTouch.y = NaN;
            smthWrongCallbackFunction();
        }
    });

    container.on(getEventName('mouseup'), (interactionEvent: InteractionEventType) => { // eslint-disable-line complexity
        const startX = containerEvent.startTouch.x;
        const startY = containerEvent.startTouch.y;
        const endX = interactionEvent.data.global.x;
        const endY = interactionEvent.data.global.y;
        const deltaX = startX - endX;
        const deltaY = startY - endY;

        const {originalEvent} = interactionEvent.data;

        if (Number.isNaN(deltaX) || Number.isNaN(deltaY) ||
            Array.isArray(originalEvent.touches) && originalEvent.touches.length !== 0) {
            smthWrongCallbackFunction();
            return;
        }

        if (Math.pow(deltaX, 2) + Math.pow(deltaY, 2) > 100) { // move delta > 10px - no click
            return;
        }

        callback();
    });
}

export function procedureMakeGraveForMapUnit(newMap: MapType, mapUnit: AttackResultUnitType) {
    const actionUnitGuideData = unitGuideData[mapUnit.type];

    if (actionUnitGuideData.withoutGrave === true) {
        console.log('unit without grave', mapUnit);
        return;
    }

    const unitGrave = find(newMap.graves, {x: mapUnit.x, y: mapUnit.y}) || null;

    if (unitGrave === null) {
        newMap.graves.push({
            x: mapUnit.x,
            y: mapUnit.y,
            removeCountdown: defaultUnitData.graveRemoveCountdown
        });
        return;
    }

    unitGrave.removeCountdown = defaultUnitData.graveRemoveCountdown;
}

export function getCommanderDataByUserIndex(userIndex: number): UnitTypeCommanderType {
    return ['galamar', 'valadorn', 'demon-lord', 'saeth'][userIndex];
}

// return additional hit points or null if no changes
export function countHealHitPointOnBuilding(newMap: MapType, mapUnit: UnitType): number | null { // eslint-disable-line complexity
    if (mapUnit.hitPoints === defaultUnitData.hitPoints) {
        return null;
    }

    if (typeof mapUnit.hitPoints !== 'number') {
        return null;
    }

    const currentUnitHitPoints = mapUnit.hitPoints;

    const building = find(newMap.buildings, {x: mapUnit.x, y: mapUnit.y}) || null;

    if (building === null) {
        return null;
    }

    const buildingType = building.type;
    let additionalHitPoints = 0;

    if (['well', 'temple'].includes(buildingType)) {
        additionalHitPoints = mapGuide.building[buildingType].hitPointsBonus;
    }

    if (['farm', 'castle'].includes(buildingType) &&
        typeof building.userId === 'string' &&
        typeof mapUnit.userId === 'string' &&
        building.userId === mapUnit.userId) {
        additionalHitPoints = mapGuide.building[buildingType].hitPointsBonus;
    }

    const endUnitHitPoints = Math.min(defaultUnitData.hitPoints, currentUnitHitPoints + additionalHitPoints);

    if (endUnitHitPoints === currentUnitHitPoints) {
        return null;
    }

    return endUnitHitPoints - currentUnitHitPoints;
}


type UnitSupplyStateType = {|
    +unitCount: number,
    +unitLimit: number,
    +isFull: boolean,
    +isOverFull: boolean
|};

export function getSupplyState(map: MapType, userId: string): UnitSupplyStateType {
    const userUnitList = map.units.filter((mapUnit: UnitType): boolean => mapUnit.userId === userId);
    const unitCount = userUnitList.length;
    const {unitLimit} = map;

    return {
        unitCount,
        unitLimit,
        isFull: unitCount >= unitLimit,
        isOverFull: unitCount > unitLimit
    };
}


type SkirmishMathResultType = {|
    winner: {|
        teamId: TeamIdType | null
    |}
|};

type MathResultType = SkirmishMathResultType;

export function isCommanderLive(userId: string, map: MapType): boolean {
    return map.units.some((mapUnit: UnitType): boolean => mapUnit.userId === userId &&
        unitGuideData[mapUnit.type].isCommander === true);
}

export function hasCastle(userId: string, map: MapType): boolean {
    return map.buildings.some((mapBuilding: BuildingType): boolean => mapBuilding.userId === userId &&
        mapBuilding.type === 'castle');
}

function isUserSkirmishLoose(userId: string, map: MapType): boolean {
    return !isCommanderLive(userId, map) && !hasCastle(userId, map);
}

function isTeamSkirmishLoose(teamId: TeamIdType, map: MapType): boolean {
    return map.userList
        .filter((mapUser: MapUserType): boolean => mapUser.teamId === teamId)
        .every((mapUser: MapUserType): boolean => isUserSkirmishLoose(mapUser.userId, map));
}

function getSkirmishMatchResult(map: MapType): SkirmishMathResultType {
    const skirmishMatchResult: SkirmishMathResultType = {
        winner: {
            teamId: null
        }
    };

    const fullTeamList: Array<TeamIdType> = JSON.parse(JSON.stringify(mapGuide.teamIdList));
    // .filter((teamId: TeamIdType): boolean => Boolean(find(map.userList, {teamId})));

    const winnerTeamList: Array<TeamIdType> = fullTeamList.filter((teamId: TeamIdType): boolean =>
        !isTeamSkirmishLoose(teamId, map));

    const winnerTeamId = winnerTeamList.length === 1 ? winnerTeamList[0] : null;

    skirmishMatchResult.winner.teamId = winnerTeamId;

    return skirmishMatchResult;
}

export function getMatchResult(map: MapType): MathResultType | null {
    if (map.type === 'skirmish') {
        return getSkirmishMatchResult(map);
    }

    console.error('unsupported map.type', map);

    return null;
}

export function getLevel(damageGiven: number): number {
    const maxLevelForCount = defaultUnitData.level.max;
    const levelScale = defaultUnitData.level.scale;
    const base = defaultUnitData.level.base;

    let level = 0;
    let levelSize = base;

    for (; level < maxLevelForCount; level += 1) {
        if (levelSize > damageGiven) {
            return level;
        }

        levelSize += base * Math.pow(levelScale, level);
    }

    return level;
}

/*
console.log('getLevel test: begin');

new Array(1000).join('.').split('').forEach((value: string, index: number) => {
    console.log(String(index).padStart(3, ' '), getLevel(index));
});

console.log('get:evel test: end');
*/

function cloneActionList(actionList: UnitActionsMapType): UnitActionsMapType {
    const newActionList = [];

    actionList.forEach((lineAction: Array<Array<UnitActionType>>, yCell: number) => {
        newActionList[yCell] = new Array(lineAction.length);
        lineAction.forEach((cellAction: Array<UnitActionType>, xCell: number) => {
            // actionMap[yCell][xCell].push(...cellAction);
            newActionList[yCell][xCell] = [];
            if (cellAction[0]) {
                newActionList[yCell][xCell][0] = cellAction[0];
            }
        });
    });

    return newActionList;
}

export function mergeActionList(actionListSource: UnitActionsMapType | null, // eslint-disable-line complexity
                                actionListExtend: UnitActionsMapType | null): UnitActionsMapType | null {
    if (actionListSource === null && actionListExtend !== null) {
        return cloneActionList(actionListExtend);
    }

    if (actionListSource !== null && actionListExtend === null) {
        return cloneActionList(actionListSource);
    }

    if (actionListSource === null || actionListExtend === null) {
        return null;
    }

    const newActionList = cloneActionList(actionListSource);

    actionListExtend.forEach((lineAction: Array<Array<UnitActionType>>, yCell: number) => {
        newActionList[yCell] = newActionList[yCell] || new Array(lineAction.length);

        lineAction.forEach((cellAction: Array<UnitActionType>, xCell: number) => {
            newActionList[yCell][xCell] = newActionList[yCell][xCell] || [];

            if (cellAction[0]) {
                newActionList[yCell][xCell][0] = cellAction[0];
            }
        });
    });

    return newActionList;
}

export function isStoreOpen(): boolean {
    return queryString.parse(window.location.search).viewId === storeViewId;
}

type PlaceForNewUnitType = {|
    +x: number,
    +y: number
|};

function hasPlaceForNewUnit(x: number, y: number, gameData: GameDataType): boolean {
    // count cross around store
    const neededCoordinates: Array<PlaceForNewUnitType> = [
        {x: x - 1, y},
        {x, y: y - 1},
        {x: x + 1, y},
        {x, y: y + 1},
        {x, y}
    ];

    return neededCoordinates.some((place: PlaceForNewUnitType): boolean => {
        // check has map needed coordinates
        const emptyActionMap = gameData.emptyActionMap;
        const placeX = place.x;
        const placeY = place.y;

        if (!emptyActionMap[placeY] || !emptyActionMap[placeY][placeX]) {
            console.log('?hasPlaceForNewUnit ---> map has no coordinate:', 'x:', placeX, 'y:', placeY);
            return false;
        }

        // check unit free place
        if (find(gameData.unitList, (unit: Unit): boolean => unit.attr.x === placeX && unit.attr.y === placeY)) {
            console.log('?hasPlaceForNewUnit ---> unit on:', 'x:', placeX, 'y:', placeY);
            return false;
        }

        return true;
    });
}

export function canOpenStore(x: number, y: number, gameData: GameDataType): boolean {
    if (isStoreOpen()) {
        console.log('? canOpenStore ---> store already open');
        return false;
    }

    if (!hasPlaceForNewUnit(x, y, gameData)) {
        console.log('? canOpenStore ---> has place for new unit');
        return false;
    }

    return true;
}


export type WrongStateTypeUnitOnUnitType = {|
    type: 'unit-on-unit',
    x: number,
    y: number
|};

export type WrongStateType = WrongStateTypeUnitOnUnitType;

export function getUnitOverUnit(gameData: GameDataType): Array<WrongStateTypeUnitOnUnitType> | null {
    const wrongStateList: Array<WrongStateTypeUnitOnUnitType> = [];

    gameData.unitList.forEach((unitInList: Unit) => {
        const unitInListX = unitInList.attr.x;
        const unitInListY = unitInList.attr.y;

        const unitForTest = find(gameData.unitList, (unit: Unit): boolean => unitInList !== unit &&
            unitInListX === unit.attr.x &&
            unitInListY === unit.attr.y);

        if (!unitForTest) {
            return;
        }

        const newWrongState = {
            type: 'unit-on-unit',
            x: unitInListX,
            y: unitInListY
        };

        if (find(wrongStateList, newWrongState)) {
            return;
        }

        wrongStateList.push(newWrongState);
    });

    return wrongStateList.length === 0 ? null : wrongStateList;
}

export function getWrongStateList(gameData: GameDataType): Array<WrongStateType> | null {
    const wrongStateList: Array<WrongStateType> = [];

    const unitOverUnitList = getUnitOverUnit(gameData) || [];

    wrongStateList.push(...unitOverUnitList);

    return wrongStateList.length === 0 ? null : wrongStateList;
}
