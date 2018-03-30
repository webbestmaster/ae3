// @flow

import type {ServerUserType} from '../../../module/server-api';
import mapGuide from './../../../maps/map-guide';
import unitGuide, {defaultUnitData} from './unit/unit-guide';
import type {UnitActionType, UnitActionsMapType, UnitActionMoveType, GameDataType} from './unit';
import {getPath, defaultOptions} from './../../../lib/a-star-finder';
import type {PathType, PointType} from './../../../lib/a-star-finder';
import type {UnitType} from '../../../maps/type';

export function getUserIndex(userId: string, userList: Array<ServerUserType>): number | null {
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

export function getUserColor(userId: string, userList: Array<ServerUserType>): string | null {
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

function canAttack(aggressor: UnitType, defender: UnitType): boolean {
    const range = unitGuide[aggressor.type].attack.range;

    return Math.abs(defender.x - aggressor.x) + Math.abs(defender.y - aggressor.y) <= range;
}


type AttackResultUnitType = {};

type AttackResultType = {|
    aggressor: AttackResultUnitType,
    defender: AttackResultUnitType
|};

export function getAttackResult(gameData: GameDataType, aggressor: UnitType, defender: UnitType): AttackResultType {
    const unitsDataForAttack = getUnitsDataForAttack(gameData, aggressor, defender);
    const aggressorData = unitsDataForAttack.aggressor;
    const defenderData = unitsDataForAttack.defender;

    return {
        aggressor: {},
        defender: {}
    };
}

type UnitDataForAttackType = {|
    +attack: {|
        +min: number,
        +max: number,
        +range: number
    |},
    +x: number,
    +y: number,
    +canAttack: boolean,
    +hitPoints: number,
    +poisonCountdown: number,
    +hasWispAura: boolean,
    +damage: {|// need to count level
        +given: number,
        +received: number
    |},
    +placeArmor: number
|};

type UnitsDataForAttackType = {|
    +aggressor: UnitDataForAttackType,
    +defender: UnitDataForAttackType
|};

function getUnitsDataForAttack(gameData: GameDataType, // eslint-disable-line complexity
                               aggressor: UnitType,
                               defender: UnitType): UnitsDataForAttackType {
    const aggressorData: UnitDataForAttackType = {
        attack: {
            min: unitGuide[aggressor.type].attack.min,
            max: unitGuide[aggressor.type].attack.max,
            range: unitGuide[aggressor.type].attack.range
        },
        x: aggressor.x,
        y: aggressor.y,
        canAttack: canAttack(aggressor, defender),
        hitPoints: typeof aggressor.hitPoints === 'number' ?
            aggressor.hitPoints :
            defaultUnitData.hitPoints,
        poisonCountdown: typeof aggressor.poisonCountdown === 'number' ?
            aggressor.poisonCountdown :
            defaultUnitData.poisonCountdown,
        hasWispAura: typeof aggressor.hasWispAura === 'boolean' ?
            aggressor.hasWispAura :
            defaultUnitData.hasWispAura,
        damage: { // need to count level
            given: aggressor.damage && typeof aggressor.damage.given === 'number' ?
                aggressor.damage.given :
                0,
            received: aggressor.damage && typeof aggressor.damage.received === 'number' ?
                aggressor.damage.received :
                0
        },
        placeArmor: typeof unitGuide[aggressor.type].moveType === 'string' ?
            gameData.armorMap[unitGuide[aggressor.type].moveType][aggressor.y][aggressor.x] :
            gameData.armorMap.walk[aggressor.y][aggressor.x]
    };

    const defenderData: UnitDataForAttackType = {
        attack: {
            min: unitGuide[defender.type].attack.min,
            max: unitGuide[defender.type].attack.max,
            range: unitGuide[defender.type].attack.range
        },
        x: defender.x,
        y: defender.y,
        canAttack: canAttack(defender, aggressor),
        hitPoints: typeof defender.hitPoints === 'number' ?
            defender.hitPoints :
            defaultUnitData.hitPoints,
        poisonCountdown: typeof defender.poisonCountdown === 'number' ?
            defender.poisonCountdown :
            defaultUnitData.poisonCountdown,
        hasWispAura: typeof defender.hasWispAura === 'boolean' ?
            defender.hasWispAura :
            defaultUnitData.hasWispAura,
        damage: { // need to count level
            given: defender.damage && typeof defender.damage.given === 'number' ?
                defender.damage.given :
                0,
            received: defender.damage && typeof defender.damage.received === 'number' ?
                defender.damage.received :
                0
        },
        placeArmor: typeof unitGuide[defender.type].moveType === 'string' ?
            gameData.armorMap[unitGuide[defender.type].moveType][defender.y][defender.x] :
            gameData.armorMap.walk[defender.y][defender.x]
    };

    return {
        aggressor: aggressorData,
        defender: defenderData
    };
}
