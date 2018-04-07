// @flow
/* global document */

import type {ServerUserType} from '../../../module/server-api';
import mapGuide from './../../../maps/map-guide';
import unitGuide, {defaultUnitData, additionalUnitData} from './unit/unit-guide';
import type {UnitActionType, UnitActionsMapType, UnitActionMoveType, GameDataType} from './unit';
import Unit from './unit';
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

export type UnitDataForAttackType = {|
    +attack: {|
        +min: number,
        +max: number,
        +range: number
    |},
    +type: string,
    +id: string,
    +userId: string,
    +armor: number,
    +x: number,
    +y: number,
    +canAttack: boolean,
    hitPoints: number, // will rewrite in getAttackDamage
    +poisonCountdown: number,
    +hasWispAura: boolean,
    +damage: {| // need to count level
        given: number, // will rewrite in getAttackDamage
        received: number // will rewrite in getAttackDamage
    |},
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
        console.warn('aggressor can not attack defender', aggressorData, defenderData);
        return {
            aggressor: aggressorData,
            defender: defenderData
        };
    }

    const resultAggressorDamage = getAttackDamage(aggressorData, defenderData);

    if (resultAggressorDamage >= defenderData.hitPoints) {
        // aggressor kill defender
        aggressorData.damage.given += defenderData.hitPoints;
        defenderData.hitPoints = 0;
        return {
            aggressor: aggressorData,
            defender: defenderData
        };
    }

    defenderData.hitPoints -= resultAggressorDamage;

    const resultDefenderDamage = getAttackDamage(defenderData, aggressorData);

    if (resultDefenderDamage >= aggressorData.hitPoints) {
        // defender kill aggressor
        defenderData.damage.given += aggressorData.hitPoints;
        aggressorData.hitPoints = 0;
        return {
            aggressor: aggressorData,
            defender: defenderData
        };
    }

    if (defenderData.canAttack === true) {
        aggressorData.hitPoints -= resultDefenderDamage;
        console.log('defender CAN strike back');
    } else {
        console.log('defender can NOT strike back');
    }

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
    console.warn('getAttackDamage - 3 - add bonus damage by unit level, count unit level from damage given/received');

    const minDamage = 1;
    const aggressorScale = aggressor.hitPoints / defaultUnitData.hitPoints;
    const aggressorSelfAttack = Math.random() * (aggressor.attack.max - aggressor.attack.min) + aggressor.attack.min;
    const aggressorAttackBonusWistAura = aggressor.hasWispAura ? additionalUnitData.wispAttackBonus : 0;
    const aggressorPoisonAttackReduce = aggressor.poisonCountdown > 0 ? additionalUnitData.poisonAttackReduce : 0;
    const aggressorEndAttack = aggressorScale *
        (aggressorSelfAttack + aggressorAttackBonusWistAura - aggressorPoisonAttackReduce);

    const defenderScale = defender.hitPoints / defaultUnitData.hitPoints;
    const defenderSelfArmor = defender.armor;
    const defenderPoisonArmorReduce = defender.poisonCountdown > 0 ? additionalUnitData.poisonArmorReduce : 0;
    const defenderPlaceArmor = defender.placeArmor;
    const defenderEndArmor = defenderScale * (defenderSelfArmor - defenderPoisonArmorReduce + defenderPlaceArmor);

    return Math.max(Math.round(aggressorEndAttack - defenderEndArmor), minDamage);
}

function getUnitsDataForAttack(gameData: GameDataType, // eslint-disable-line complexity
                               aggressor: Unit,
                               defender: Unit): UnitsDataForAttackType {
    const aggressorData: UnitDataForAttackType = {
        attack: {
            min: unitGuide[aggressor.attr.type].attack.min,
            max: unitGuide[aggressor.attr.type].attack.max,
            range: unitGuide[aggressor.attr.type].attack.range
        },
        type: aggressor.attr.type,
        id: typeof aggressor.attr.id === 'string' ? aggressor.attr.id : 'no-aggressor-id-' + Math.random(),
        userId: typeof aggressor.attr.userId === 'string' ?
            aggressor.attr.userId :
            'no-aggressor-user-id-' + Math.random(),
        armor: unitGuide[aggressor.attr.type].armor,
        x: aggressor.attr.x,
        y: aggressor.attr.y,
        canAttack: aggressor.canAttack(defender),
        hitPoints: aggressor.getHitPoints(),
        poisonCountdown: typeof aggressor.attr.poisonCountdown === 'number' ?
            aggressor.attr.poisonCountdown :
            defaultUnitData.poisonCountdown,
        hasWispAura: aggressor.hasWispAura(),
        damage: { // need to count level
            given: aggressor.attr.damage && typeof aggressor.attr.damage.given === 'number' ?
                aggressor.attr.damage.given :
                0,
            received: aggressor.attr.damage && typeof aggressor.attr.damage.received === 'number' ?
                aggressor.attr.damage.received :
                0
        },
        placeArmor: typeof unitGuide[aggressor.attr.type].moveType === 'string' ?
            gameData.armorMap[unitGuide[aggressor.attr.type].moveType][aggressor.attr.y][aggressor.attr.x] :
            gameData.armorMap.walk[aggressor.attr.y][aggressor.attr.x]
    };

    const defenderData: UnitDataForAttackType = {
        attack: {
            min: unitGuide[defender.attr.type].attack.min,
            max: unitGuide[defender.attr.type].attack.max,
            range: unitGuide[defender.attr.type].attack.range
        },
        type: defender.attr.type,
        id: typeof defender.attr.id === 'string' ? defender.attr.id : 'no-defender-id-' + Math.random(),
        userId: typeof defender.attr.userId === 'string' ?
            defender.attr.userId :
            'no-defender-user-id-' + Math.random(),
        armor: unitGuide[defender.attr.type].armor,
        x: defender.attr.x,
        y: defender.attr.y,
        canAttack: defender.canAttack(aggressor),
        hitPoints: defender.getHitPoints(),
        poisonCountdown: typeof defender.attr.poisonCountdown === 'number' ?
            defender.attr.poisonCountdown :
            defaultUnitData.poisonCountdown,
        hasWispAura: defender.hasWispAura(),
        damage: { // need to count level
            given: defender.attr.damage && typeof defender.attr.damage.given === 'number' ?
                defender.attr.damage.given :
                0,
            received: defender.attr.damage && typeof defender.attr.damage.received === 'number' ?
                defender.attr.damage.received :
                0
        },
        placeArmor: typeof unitGuide[defender.attr.type].moveType === 'string' ?
            gameData.armorMap[unitGuide[defender.attr.type].moveType][defender.attr.y][defender.attr.x] :
            gameData.armorMap.walk[defender.attr.y][defender.attr.x]
    };

    return {
        aggressor: aggressorData,
        defender: defenderData
    };
}

export function getEventName(pcEventName: 'click'): 'click' | 'tap' {
    const eventNameMap = {
        click: 'tap'
    };

    const hasInMap = typeof eventNameMap[pcEventName] === 'string';

    // check for mobile events
    if ('ontouchstart' in document) {
        if (hasInMap) {
            return eventNameMap[pcEventName];
        }
        return 'tap';
    }

    return hasInMap ? pcEventName : 'click';
}
