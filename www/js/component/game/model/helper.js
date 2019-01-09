// @flow

/* global document, location */

import {mapGuide, type TeamIdType, type UserColorType} from '../../../maps/map-guide';
import type {UnitMoveType, UnitTypeAllType, UnitTypeCommanderType} from './unit/unit-guide';
import {additionalUnitData, defaultUnitData, unitGuideData} from './unit/unit-guide';
import type {GameDataType, UnitActionMoveType, UnitActionsMapType, UnitActionType} from './unit/unit';
import {Unit} from './unit/unit';
import type {PathType} from '../../../lib/a-star-finder/a-star-finder';
import {defaultOptions, getPath} from '../../../lib/a-star-finder/a-star-finder';
import type {
    BuildingAttrTypeType,
    BuildingType,
    LandscapeType,
    MapType,
    MapUserType,
    ReducedLandscapeType,
    UnitType,
} from '../../../maps/type';
import find from 'lodash/find';
import * as PIXI from 'pixi.js';
import {storeViewId} from '../../store/c-store';
import queryString from 'query-string';
import type {RoomTypeType} from '../../../module/server-api';
import {isNotNumber, isString} from '../../../lib/is/is';
import {Building} from './building/building';
import {wait} from '../../../lib/sleep';

type InteractionEventType = {
    +data: {
        +global: {
            +x: number,
            +y: number,
        },
        +originalEvent: {
            touches?: TouchList,
        },
    },
};

export function getUserIndex(userId: string, userList: Array<MapUserType>): number | null {
    let userIndex = 0;
    const maxIndex = 4;

    // eslint-disable-next-line no-loops/no-loops
    while (userList[userIndex] && userList[userIndex].userId !== userId && userIndex < maxIndex) {
        userIndex += 1;
    }

    if (userIndex === maxIndex) {
        return null;
    }

    return userIndex;
}

export function getUserColor(userId: string, userList: Array<MapUserType>): UserColorType | null {
    const userIndex = getUserIndex(userId, userList);

    if (userIndex === null) {
        return null;
    }

    return mapGuide.colorList[userIndex] || null;
}

const hasPath = '.';

function unitActionMapToPathMap(actionsList: UnitActionsMapType): Array<string> {
    const noPath = isString(defaultOptions.noPath) ? defaultOptions.noPath : null;

    if (noPath === null) {
        console.error('unitActionMapToPathMap - noPath is not defined');
        return [];
    }

    return actionsList
        .map(
            (unitActionLine: Array<Array<UnitActionType>>): Array<string> => {
                return unitActionLine.map(
                    (unitActionList: Array<UnitActionType>): string => {
                        const hasMoveType = unitActionList.some(
                            (unitAction: UnitActionType): boolean => {
                                return unitAction.type === 'move';
                            }
                        );

                        return hasMoveType ? hasPath : noPath;
                    }
                );
            }
        )
        .map((mapLine: Array<string>): string => mapLine.join(''));
}

export function getMoviePath(unitAction: UnitActionMoveType, actionsList: UnitActionsMapType): PathType | null {
    const unitPathMap = unitActionMapToPathMap(actionsList);

    return getPath(unitPathMap, [unitAction.from.x, unitAction.from.y], [unitAction.to.x, unitAction.to.y]);
}

export function getMovieWidePath(unitAction: UnitActionMoveType, gameData: GameDataType, unit: Unit): PathType | null {
    const unitPathMap = gameDataToToPathMap(gameData, unit);

    return getPath(unitPathMap, [unitAction.from.x, unitAction.from.y], [unitAction.to.x, unitAction.to.y]);
}

export function gameDataToToPathMap(gameData: GameDataType, unit: Unit): Array<string> {
    const noPath = isString(defaultOptions.noPath) ? defaultOptions.noPath : null;

    if (noPath === null) {
        console.error('gameDataToToPathMap - noPath is not defined');
        return [];
    }

    const walkMap = gameData.pathMap.walk;

    return walkMap.map(
        (line: Array<number>, cellY: number): string => {
            const pathStateList = line.map(
                (walkPay: number, cellX: number): string => {
                    const {unitList} = gameData;

                    const unitOnCell =
                        unitList.find(
                            (unitInLint: Unit): boolean => {
                                const unitAttr = unitInLint.attr;

                                return unitAttr.x === cellX && unitAttr.y === cellY;
                            }
                        ) || null;

                    if (unitOnCell === null) {
                        return hasPath;
                    }

                    if (unitOnCell.attr.userId === unit.attr.userId) {
                        return hasPath;
                    }

                    return noPath;
                }
            );

            return pathStateList.join('');
        }
    );
}

export type UnitDataForAttackType = {|
    +attack: {|
        +min: number,
        +max: number,
        +range: number,
    |},
    +moveType: UnitMoveType,
    +bonusAtkAgainstFly: number,
    +bonusAtkAgainstSkeleton: number,
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
    +damage: {|
        // need to count level
        +given: number, // will rewrite in getAttackDamage
        +received: number, // will rewrite in getAttackDamage
    |},
    +level: {|
        +value: number,
        +attack: number,
        +armor: number,
    |},
    +placeArmor: number,
|};

export type AttackResultUnitType = UnitDataForAttackType;

export type AttackResultType = {|
    aggressor: AttackResultUnitType,
    defender: AttackResultUnitType,
|};

// eslint-disable-next-line max-statements, complexity
export function getAttackResult(gameData: GameDataType, aggressor: Unit, defender: Unit): AttackResultType {
    const unitsDataForAttack = getUnitsDataForAttack(gameData, aggressor, defender);
    const aggressorData = unitsDataForAttack.aggressor;
    const defenderData = unitsDataForAttack.defender;

    if (aggressorData.canAttack === false) {
        console.error('aggressor can not attack defender', aggressorData, defenderData);
        return {
            aggressor: aggressorData,
            defender: defenderData,
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
            defender: defenderData,
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
            defender: defenderData,
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
            defender: defenderData,
        };
    }

    defenderData.damage.given += resultDefenderDamage;
    aggressorData.damage.received += resultDefenderDamage;
    aggressorData.hitPoints -= resultDefenderDamage;
    aggressorData.poisonCountdown = Math.max(aggressorData.poisonCountdown, defenderData.poisonAttack);

    return {
        aggressor: aggressorData,
        defender: defenderData,
    };
}

type UnitsDataForAttackType = {|
    +aggressor: UnitDataForAttackType,
    +defender: UnitDataForAttackType,
|};

// eslint-disable-next-line complexity
function getAttackDamage(aggressor: UnitDataForAttackType, defender: UnitDataForAttackType): number {
    const minDamage = 1;
    const aggressorScale = aggressor.hitPoints / defaultUnitData.hitPoints;

    // TODO: add Math.random() * instead of 0.5 *
    console.warn('getAttackDamage - return Math.random() instead of 0.5');
    const aggressorSelfAttack = 0.5 * (aggressor.attack.max - aggressor.attack.min) + aggressor.attack.min;

    const aggressorAttackLevelBonus = aggressor.level.attack;
    const aggressorAttackBonusWistAura = aggressor.hasWispAura ? additionalUnitData.wispAttackBonus : 0;
    const aggressorPoisonAttackReduce = aggressor.poisonCountdown > 0 ? additionalUnitData.poisonAttackReduce : 0;
    const aggressorVersusFlyAttackBonus = defender.moveType === 'fly' ? aggressor.bonusAtkAgainstFly : 0;
    const aggressorVersusSkeletonAttackBonus = defender.type === 'skeleton' ? aggressor.bonusAtkAgainstSkeleton : 0;

    const aggressorEndAttack =
        aggressorSelfAttack +
        aggressorAttackLevelBonus +
        aggressorAttackBonusWistAura +
        aggressorVersusFlyAttackBonus +
        aggressorVersusSkeletonAttackBonus -
        aggressorPoisonAttackReduce;

    // const defenderScale = defender.hitPoints / defaultUnitData.hitPoints;
    const defenderSelfArmor = defender.armor;
    const defenderLevelArmor = defender.level.armor;
    const defenderPlaceArmor = defender.placeArmor;
    const defenderPoisonArmorReduce = defender.poisonCountdown > 0 ? additionalUnitData.poisonArmorReduce : 0;
    const defenderEndArmor = defenderSelfArmor + defenderLevelArmor + defenderPlaceArmor - defenderPoisonArmorReduce;

    return Math.max(Math.floor((aggressorEndAttack - defenderEndArmor) * aggressorScale), minDamage);
}

// eslint-disable-next-line complexity
function getUnitsDataForAttack(gameData: GameDataType, aggressor: Unit, defender: Unit): UnitsDataForAttackType {
    const aggressorGuideData = aggressor.getGuideData();

    const aggressorMoveType = isString(aggressorGuideData.moveType) ? aggressorGuideData.moveType : 'walk';

    const aggressorData: UnitDataForAttackType = {
        attack: {
            min: aggressorGuideData.attack.min,
            max: aggressorGuideData.attack.max,
            range: aggressorGuideData.attack.range,
        },
        moveType: aggressorMoveType,
        bonusAtkAgainstFly: aggressorGuideData.bonusAtkAgainstFly,
        bonusAtkAgainstSkeleton: aggressorGuideData.bonusAtkAgainstSkeleton,
        poisonAttack: aggressor.getPoisonAttack(),
        type: aggressor.attr.type,
        id: isString(aggressor.attr.id) ? aggressor.attr.id : 'no-aggressor-id-' + Math.random(),
        userId: isString(aggressor.attr.userId) ? aggressor.attr.userId : 'no-aggressor-user-id-' + Math.random(),
        armor: aggressorGuideData.armor,
        x: aggressor.attr.x,
        y: aggressor.attr.y,
        canAttack: aggressor.canAttack(defender),
        hitPoints: aggressor.getHitPoints(),
        poisonCountdown: aggressor.getPoisonCountdown(),
        hasWispAura: aggressor.hasWispAura(),
        damage: {
            given: aggressor.getDamageGiven(),
            received: aggressor.getDamageReceived(),
        },
        level: {
            value: aggressor.getLevel(),
            armor: aggressor.getLevel() * defaultUnitData.level.additional.armor,
            attack: aggressor.getLevel() * defaultUnitData.level.additional.attack,
        },
        placeArmor: gameData.armorMap[aggressorMoveType][aggressor.attr.y][aggressor.attr.x],
    };

    const defenderGuideData = defender.getGuideData();

    const defenderMoveType = isString(defenderGuideData.moveType) ? defenderGuideData.moveType : 'walk';

    const defenderData: UnitDataForAttackType = {
        attack: {
            min: defenderGuideData.attack.min,
            max: defenderGuideData.attack.max,
            range: defenderGuideData.attack.range,
        },
        moveType: defenderMoveType,
        bonusAtkAgainstFly: defenderGuideData.bonusAtkAgainstFly,
        bonusAtkAgainstSkeleton: defenderGuideData.bonusAtkAgainstSkeleton,
        poisonAttack: defender.getPoisonAttack(),
        type: defender.attr.type,
        id: isString(defender.attr.id) ? defender.attr.id : 'no-defender-id-' + Math.random(),
        userId: isString(defender.attr.userId) ? defender.attr.userId : 'no-defender-user-id-' + Math.random(),
        armor: defenderGuideData.armor,
        x: defender.attr.x,
        y: defender.attr.y,
        canAttack: defender.canAttack(aggressor),
        hitPoints: defender.getHitPoints(),
        poisonCountdown: defender.getPoisonCountdown(),
        hasWispAura: defender.hasWispAura(),
        damage: {
            given: defender.getDamageGiven(),
            received: defender.getDamageReceived(),
        },
        level: {
            value: defender.getLevel(),
            armor: defender.getLevel() * defaultUnitData.level.additional.armor,
            attack: defender.getLevel() * defaultUnitData.level.additional.attack,
        },
        placeArmor: isString(defenderGuideData.moveType) ?
            gameData.armorMap[defenderGuideData.moveType][defender.attr.y][defender.attr.x] :
            gameData.armorMap.walk[defender.attr.y][defender.attr.x],
    };

    return {
        aggressor: aggressorData,
        defender: defenderData,
    };
}

type MouseEventNameType = 'click' | 'mousedown' | 'mouseup' | 'mousemove';
type TouchEventNameType = 'tap' | 'touchstart' | 'touchend' | 'touchmove';
type EventNameMapType = {+[key: MouseEventNameType]: TouchEventNameType};

export function getEventName(MouseEventName: MouseEventNameType): MouseEventNameType | TouchEventNameType {
    const eventNameMap: EventNameMapType = {
        click: 'tap',
        mousedown: 'touchstart',
        mouseup: 'touchend',
        mousemove: 'touchmove',
    };

    const hasInMap = isString(eventNameMap[MouseEventName]);

    // check for mobile events
    if ('ontouchstart' in document) {
        return hasInMap ? eventNameMap[MouseEventName] : 'tap';
    }

    return hasInMap ? MouseEventName : 'click';
}

function noop() {}

export function bindClick(container: PIXI.Container, callback: () => Promise<void>, smthWrongCallback?: () => void) {
    const containerEvent = {
        startTouch: {
            x: NaN,
            y: NaN,
        },
    };

    const smthWrongCallbackFunction = smthWrongCallback || noop;

    container.on(getEventName('mousedown'), (interactionEvent: InteractionEventType) => {
        containerEvent.startTouch.x = interactionEvent.data.global.x;
        containerEvent.startTouch.y = interactionEvent.data.global.y;

        const {originalEvent} = interactionEvent.data;

        // this is not fix problem, but make problem more hard reproducible
        if (originalEvent.touches && originalEvent.touches.length > 1) {
            containerEvent.startTouch.x = NaN;
            containerEvent.startTouch.y = NaN;
            smthWrongCallbackFunction();
        }

        wait(0.3e3)
            .then(
                (): Promise<void> => {
                    containerEvent.startTouch.x = NaN;
                    containerEvent.startTouch.y = NaN;

                    return Promise.resolve();
                }
            )
            .catch(
                (error: Error): Error => {
                    console.error('bindClick() end with error!');
                    console.error(error);
                    return error;
                }
            );
    });

    // eslint-disable-next-line complexity
    container.on(getEventName('mouseup'), (interactionEvent: InteractionEventType) => {
        const startX = containerEvent.startTouch.x;
        const startY = containerEvent.startTouch.y;
        const endX = interactionEvent.data.global.x;
        const endY = interactionEvent.data.global.y;
        const deltaX = startX - endX;
        const deltaY = startY - endY;

        const {originalEvent} = interactionEvent.data;

        if (
            Number.isNaN(deltaX) ||
            Number.isNaN(deltaY) ||
            originalEvent.touches && originalEvent.touches.length !== 0
        ) {
            smthWrongCallbackFunction();
            return;
        }

        if (deltaX ** 2 + deltaY ** 2 > 100) {
            // move delta > 10px - no click
            return;
        }

        callback();
    });
}

export function bindHold(container: PIXI.Container, callback: () => Promise<void>, smthWrongCallback?: () => void) {
    const containerEvent = {
        startTouch: {
            x: NaN,
            y: NaN,
        },
    };

    const smthWrongCallbackFunction = smthWrongCallback || noop;

    container.on(getEventName('mousedown'), (interactionEvent: InteractionEventType) => {
        containerEvent.startTouch.x = interactionEvent.data.global.x;
        containerEvent.startTouch.y = interactionEvent.data.global.y;

        const {originalEvent} = interactionEvent.data;

        const beforeX = containerEvent.startTouch.x;
        const beforeY = containerEvent.startTouch.y;

        wait(0.5e3)
            .then(
                (): Promise<void> => {
                    if (
                        Math.abs(beforeX - containerEvent.startTouch.x) < 10 &&
                        Math.abs(beforeY - containerEvent.startTouch.y) < 10
                    ) {
                        // eslint-disable-next-line promise/no-callback-in-promise
                        return callback();
                    }
                    return Promise.resolve();
                }
            )
            .catch(
                (error: Error): Error => {
                    console.error('bindHold() end with error!');
                    console.error(error);
                    return error;
                }
            );

        // this is not fix problem, but make problem more hard reproducible
        if (originalEvent.touches && originalEvent.touches.length > 1) {
            containerEvent.startTouch.x = NaN;
            containerEvent.startTouch.y = NaN;
            smthWrongCallbackFunction();
        }
    });

    // eslint-disable-next-line complexity
    container.on(getEventName('mouseup'), () => {
        containerEvent.startTouch.x = NaN;
        containerEvent.startTouch.y = NaN;
    });

    container.on(getEventName('mousemove'), (interactionEvent: InteractionEventType) => {
        const beforeX = containerEvent.startTouch.x;
        const beforeY = containerEvent.startTouch.y;

        if (
            Math.abs(beforeX - containerEvent.startTouch.x) < 10 &&
            Math.abs(beforeY - containerEvent.startTouch.y) < 10
        ) {
            // eslint-disable-next-line promise/no-callback-in-promise
            containerEvent.startTouch.x = NaN;
            containerEvent.startTouch.y = NaN;
        }
    });
}

export function procedureMakeGraveForMapUnit(newMap: MapType, mapUnit: AttackResultUnitType) {
    const actionUnitGuideData = unitGuideData[mapUnit.type];

    if (actionUnitGuideData.hasGrave === false) {
        console.log('unit without grave', mapUnit);
        return;
    }

    const unitGrave = find(newMap.graves, {x: mapUnit.x, y: mapUnit.y}) || null;

    if (unitGrave === null) {
        newMap.graves.push({
            x: mapUnit.x,
            y: mapUnit.y,
            removeCountdown: defaultUnitData.graveRemoveCountdown,
        });
        return;
    }

    unitGrave.removeCountdown = defaultUnitData.graveRemoveCountdown;
}

export function getCommanderTypeByUserIndex(userIndex: number): UnitTypeCommanderType {
    return mapGuide.commanderList[userIndex];
}

// return additional hit points or null if no changes
// eslint-disable-next-line complexity
export function countHealHitPointOnBuilding(newMap: MapType, mapUnit: UnitType): number | null {
    if (mapUnit.hitPoints === defaultUnitData.hitPoints) {
        return null;
    }

    if (isNotNumber(mapUnit.hitPoints)) {
        return null;
    }

    const currentUnitHitPoints = mapUnit.hitPoints;

    const building = find(newMap.buildings, {x: mapUnit.x, y: mapUnit.y}) || null;

    if (building === null) {
        return null;
    }

    const buildingType = building.type;
    let additionalHitPoints = 0;

    if ([mapGuide.building.well.name, mapGuide.building.temple.name].includes(buildingType)) {
        additionalHitPoints = mapGuide.building[buildingType].hitPointsBonus;
    }

    if (
        [mapGuide.building.farm.name, mapGuide.building.castle.name].includes(buildingType) &&
        isString(building.userId) &&
        isString(mapUnit.userId) &&
        building.userId === mapUnit.userId
    ) {
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
    +isOverFull: boolean,
|};

export function getSupplyState(map: MapType, userId: string): UnitSupplyStateType {
    const userUnitList = map.units.filter((mapUnit: UnitType): boolean => mapUnit.userId === userId);
    const unitCount = userUnitList.length;
    const {unitLimit} = map;

    return {
        unitCount,
        unitLimit,
        isFull: unitCount >= unitLimit,
        isOverFull: unitCount > unitLimit,
    };
}

type SkirmishMathResultType = {|
    winner: {|
        teamId: TeamIdType | null,
    |},
|};

type MathResultType = SkirmishMathResultType;

export function isCommanderLive(userId: string, map: MapType): boolean {
    return map.units.some(
        (mapUnit: UnitType): boolean => mapUnit.userId === userId && unitGuideData[mapUnit.type].isCommander === true
    );
}

export function hasCastle(userId: string, map: MapType): boolean {
    return map.buildings.some(
        (mapBuilding: BuildingType): boolean =>
            mapBuilding.userId === userId && mapBuilding.type === mapGuide.building.castle.name
    );
}

function getSkirmishIsUserDefeat(userId: string, map: MapType): boolean {
    return !isCommanderLive(userId, map) && !hasCastle(userId, map);
}

function isTeamSkirmishDefeat(teamId: TeamIdType, map: MapType): boolean {
    return map.userList
        .filter((mapUser: MapUserType): boolean => mapUser.teamId === teamId)
        .every((mapUser: MapUserType): boolean => getSkirmishIsUserDefeat(mapUser.userId, map));
}

function getSkirmishMatchResult(map: MapType): SkirmishMathResultType {
    const skirmishMatchResult: SkirmishMathResultType = {
        winner: {
            teamId: null,
        },
    };

    const fullTeamList: Array<TeamIdType> = JSON.parse(JSON.stringify(mapGuide.teamIdList));
    // .filter((teamId: TeamIdType): boolean => Boolean(find(map.userList, {teamId})));

    const winnerTeamList: Array<TeamIdType> = fullTeamList.filter(
        (teamId: TeamIdType): boolean => !isTeamSkirmishDefeat(teamId, map)
    );

    skirmishMatchResult.winner.teamId = winnerTeamList.length === 1 ? winnerTeamList[0] : null;

    return skirmishMatchResult;
}

export function getMatchResult(map: MapType): MathResultType | null {
    if (map.type === 'skirmish') {
        return getSkirmishMatchResult(map);
    }

    console.error('unsupported map.type', map);

    return null;
}

export function isUserDefeat(userId: string, map: MapType): boolean {
    if (map.type === 'skirmish') {
        return getSkirmishIsUserDefeat(userId, map);
    }

    console.error('unsupported map.type', map);

    return false;
}

export type LevelDataType = {|
    +level: number,
    +experience: {|
        +value: number,
        +from: number,
        +part: number,
        +to: number,
        +size: number,
        +percent: number,
    |},
|};

export function getLevelData(damageGiven: number): LevelDataType {
    const experience = damageGiven;
    const maxLevel = defaultUnitData.level.max;
    const levelBase = defaultUnitData.level.base;

    let experienceFrom = 0;
    let experienceTo = 0;

    let level = 0;

    // eslint-disable-next-line no-loops/no-loops
    for (; level < maxLevel; level += 1) {
        experienceFrom = level * (level + 1) / 2 * levelBase;
        experienceTo = (level + 1) * (level + 2) / 2 * levelBase;

        if (experience >= experienceFrom && experience < experienceTo) {
            return {
                level,
                experience: {
                    value: experience,
                    from: experienceFrom,
                    part: experience - experienceFrom,
                    to: experienceTo,
                    size: experienceTo - experienceFrom,
                    percent: (experience - experienceFrom) / (experienceTo - experienceFrom) * 100,
                },
            };
        }
    }

    experienceFrom = (maxLevel - 1) * maxLevel / 2 * levelBase;
    experienceTo = maxLevel * (maxLevel + 1) / 2 * levelBase;

    console.log('--- max level ---');

    return {
        level: defaultUnitData.level.max,
        experience: {
            value: experience,
            from: experienceFrom,
            part: experience - experienceFrom,
            to: experienceTo,
            size: experienceTo - experienceFrom,
            percent: (experience - experienceFrom) / (experienceTo - experienceFrom) * 100,
        },
    };
}

/*
for (let i = 0; i < 7000; i++) {
    console.log(i, getLevelData(i));
}
*/

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

// eslint-disable-next-line complexity
export function mergeActionList(
    actionListSource: UnitActionsMapType | null,
    actionListExtend: UnitActionsMapType | null
): UnitActionsMapType | null {
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
    return queryString.parse(location.search).viewId === storeViewId;
}

type PlaceForNewUnitType = {|
    +x: number,
    +y: number,
|};

function hasPlaceForNewUnit(x: number, y: number, gameData: GameDataType): boolean {
    // count cross around store
    const neededCoordinates: Array<PlaceForNewUnitType> = [
        {x: x - 1, y},
        {x, y: y - 1},
        {x: x + 1, y},
        {x, y: y + 1},
        {x, y},
    ];

    return neededCoordinates.some(
        (place: PlaceForNewUnitType): boolean => {
            // check has map needed coordinates
            const emptyActionMap = gameData.emptyActionMap;
            const placeX = place.x;
            const placeY = place.y;

            if (!emptyActionMap[placeY] || !emptyActionMap[placeY][placeX]) {
                console.log('?hasPlaceForNewUnit ---> map has no coordinate:', 'x:', placeX, 'y:', placeY);
                return false;
            }

            // check unit free place
            const unitOnPlace =
                gameData.unitList.find(
                    (unitInList: Unit): boolean => unitInList.attr.x === placeX && unitInList.attr.y === placeY
                ) || null;

            if (unitOnPlace === null) {
                return true;
            }

            console.log('?hasPlaceForNewUnit ---> unit on:', 'x:', placeX, 'y:', placeY);
            return false;
        }
    );
}

export function canOpenStore(x: number, y: number, gameData: GameDataType): boolean {
    if (isStoreOpen()) {
        console.log('? canOpenStore ---> store already open');
        return false;
    }

    if (!hasPlaceForNewUnit(x, y, gameData)) {
        console.log('? canOpenStore ---> NO place for new unit');
        return false;
    }

    const {activeUserId} = gameData;

    const buildingStore =
        gameData.buildingList.find(
            (buildingInList: Building): boolean => {
                const buildingAttr = buildingInList.attr;

                return (
                    // eslint-disable-next-line lodash/prefer-matches
                    buildingAttr.userId === activeUserId &&
                    buildingAttr.x === x &&
                    buildingAttr.y === y &&
                    buildingAttr.type === 'castle'
                );
            }
        ) || null;

    return Boolean(buildingStore);
}

export type WrongStateTypeUnitOnUnitType = {|
    type: 'unit-on-unit',
    x: number,
    y: number,
|};

export type WrongStateType = WrongStateTypeUnitOnUnitType;

export function getUnitOverUnit(gameData: GameDataType): Array<WrongStateTypeUnitOnUnitType> | null {
    const wrongStateList: Array<WrongStateTypeUnitOnUnitType> = [];

    gameData.unitList.forEach((unitInList: Unit) => {
        const unitInListX = unitInList.attr.x;
        const unitInListY = unitInList.attr.y;

        const unitForTest = find(
            gameData.unitList,
            (unit: Unit): boolean => unitInList !== unit && unitInListX === unit.attr.x && unitInListY === unit.attr.y
        );

        if (!unitForTest) {
            return;
        }

        const newWrongState = {
            type: 'unit-on-unit',
            x: unitInListX,
            y: unitInListY,
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

export function isOnLineRoomType(): boolean {
    return location.href.includes('/on-line/');
}

export function getRoomType(): RoomTypeType {
    return isOnLineRoomType() ? 'on-line' : 'off-line';
}

type MapSizeDataType = {|
    +width: number,
    +height: number,
    +aspectRatio: number,
|};

export function getMapSize(map: MapType): MapSizeDataType {
    const defaultData = {
        width: 0,
        height: 0,
        aspectRatio: 0,
    };

    const height = map.landscape.length;

    if (height === 0) {
        return defaultData;
    }

    const width = map.landscape[0].length;

    if (width === 0) {
        return defaultData;
    }

    return {
        width,
        height,
        aspectRatio: height / width,
    };
}

// eslint-disable-next-line complexity
export function getReducedLandscapeType(map: MapType, tileX: number, tileY: number): ReducedLandscapeType {
    const landscapeImageType = getRenderLandscapeType(map, tileX, tileY);
    const landscapeType = landscapeImageType.replace(/-\d$/, '');

    if (
        landscapeType === 'bridge' ||
        landscapeType === 'forest' ||
        landscapeType === 'hill' ||
        landscapeType === 'road' ||
        landscapeType === 'stone' ||
        landscapeType === 'terra' ||
        landscapeType === 'water'
    ) {
        return landscapeType;
    }

    console.error('can not detect reduced landscape type, return road');

    return 'road';
}

// eslint-disable-next-line  sonarjs/cognitive-complexity, complexity
export function getSquareReducedLandscapeType(map: MapType, tileX: number, tileY: number): Array<ReducedLandscapeType> {
    const centerTile = getReducedLandscapeType(map, tileX, tileY);

    const leftUpTile =
        map.landscape[tileY - 1] && map.landscape[tileY - 1][tileX - 1] ?
            getReducedLandscapeType(map, tileX - 1, tileY - 1) :
            centerTile;
    const upTile =
        map.landscape[tileY - 1] && map.landscape[tileY - 1][tileX] ?
            getReducedLandscapeType(map, tileX, tileY - 1) :
            centerTile;
    const rightUpTile =
        map.landscape[tileY - 1] && map.landscape[tileY - 1][tileX + 1] ?
            getReducedLandscapeType(map, tileX + 1, tileY - 1) :
            centerTile;

    const leftTile =
        map.landscape[tileY] && map.landscape[tileY][tileX - 1] ?
            getReducedLandscapeType(map, tileX - 1, tileY) :
            centerTile;
    const rightTile =
        map.landscape[tileY] && map.landscape[tileY][tileX + 1] ?
            getReducedLandscapeType(map, tileX + 1, tileY) :
            centerTile;

    const leftBottomTile =
        map.landscape[tileY + 1] && map.landscape[tileY + 1][tileX - 1] ?
            getReducedLandscapeType(map, tileX - 1, tileY + 1) :
            centerTile;
    const bottomTile =
        map.landscape[tileY + 1] && map.landscape[tileY + 1][tileX] ?
            getReducedLandscapeType(map, tileX, tileY + 1) :
            centerTile;
    const rightBottomTile =
        map.landscape[tileY + 1] && map.landscape[tileY + 1][tileX + 1] ?
            getReducedLandscapeType(map, tileX + 1, tileY + 1) :
            centerTile;

    return [
        leftUpTile,
        upTile,
        rightUpTile,
        leftTile,
        centerTile,
        rightTile,
        leftBottomTile,
        bottomTile,
        rightBottomTile,
    ];
}

function isBridge(baseTile: ReducedLandscapeType): boolean {
    return baseTile === 'bridge';
}

function isNotBridge(baseTile: ReducedLandscapeType): boolean {
    return !isBridge(baseTile);
}

export function isNeedDrawAngleLine(baseTile: ReducedLandscapeType, testTile: ReducedLandscapeType): boolean {
    return baseTile !== testTile && isNotBridge(testTile);
}

// eslint-disable-next-line complexity
export function isNeedDrawSmallAngle(
    baseTile: ReducedLandscapeType,
    baseTileA: ReducedLandscapeType,
    baseTileB: ReducedLandscapeType,
    testTitle: ReducedLandscapeType
): boolean {
    return (
        (baseTile === baseTileA || isBridge(baseTileA)) &&
        (baseTile === baseTileB || isBridge(baseTileB)) &&
        (baseTile !== testTitle && isNotBridge(testTitle))
    );
}

// eslint-disable-next-line complexity
export function isNeedDrawBigAngle(
    baseTile: ReducedLandscapeType,
    baseTileA: ReducedLandscapeType,
    baseTileB: ReducedLandscapeType
): boolean {
    return (
        baseTile !== baseTileA && isNotBridge(baseTileA) && (baseTile !== baseTileB && isNotBridge(baseTileB))
        // (baseTile !== testTitle && isNotBridge(testTitle))
    );
}

export function getBuildingType(map: MapType, x: number, y: number): BuildingAttrTypeType | null {
    const building =
        map.buildings.find((buildingOnMap: BuildingType): boolean => buildingOnMap.x === x && buildingOnMap.y === y) ||
        null;

    if (building === null) {
        return null;
    }

    return building.type;
}

export function getRenderLandscapeType(map: MapType, x: number, y: number): LandscapeType {
    const buildingType = getBuildingType(map, x, y);

    if (buildingType === null) {
        return map.landscape[y][x];
    }

    if (['castle', 'well', 'temple'].includes(buildingType)) {
        return 'road-0';
    }

    return 'terra-0';
}
