// @flow

import type {BotResultActionDataType, EnemyUnitAllAvailableActionsMapType} from './bot';
import {defaultUnitData, unitGuideData} from './unit/unit-guide';

type PointType = {|
    +x: number,
    +y: number,
|};

export type RawRateType = {|
    // done
    +attack: {|
        +damageGiven: number, // done
        +damageReceived: number, // done
        +hitPoints: number, // done
    |},

    // done
    +unit: {|
        // done
        +endPosition: {|
            +x: number, // done
            +y: number, // done
        |},
        hitPoints: number, // done // unit with bigger hp has priority, to attack and move on front
    |},

    // use together: placeArmor and availableDamageGiven
    +placeArmor: number, // done
    +availableGivenDamage: number, // done

    /*
     *
     * castle or farm, will stimulate unit to move ahead
     * count path size to building from current position (f. e. 14)
     * count path size to building from new position (f. e. 9)
     * count diff - 14 - 9 = 5
     * direction (place) to nearest building has bigger diff
     * use this logic if building is NOT reached only
     *
     * */
    +pathSizeToNearOccupyAbleBuilding: number, // in progress
    +isReachedNearOccupyAbleBuilding: boolean, // in progress
    +pathSizeToNearHealsBuilding: number, // in progress // use if unit has < 50hp
    +isReachedToNearHealsBuilding: boolean, // in progress // use if unit has < 50hp

    +canRaiseSkeleton: boolean, // in progress

    // farm
    +canFixFarm: boolean, // in progress
    +canOccupyEnemyFarm: boolean, // in progress
    +canOccupyNoManFarm: boolean, // in progress
    +canDestroyEnemyFarm: boolean, // in progress
    // +canDestroyNoManFarm: boolean,  // will not be done // catapult can not destroy no man's farm

    // castle
    +canOccupyEnemyCastle: boolean, // in progress
    +canOccupyNoManCastle: boolean, // in progress

    +canPreventEnemyFixFarm: boolean, // in progress

    +canPreventEnemyOccupyNoManFarm: boolean, // in progress
    +canPreventEnemyOccupyMyFarm: boolean, // in progress
    +canPreventEnemyOccupyMyTeamFarm: boolean, // in progress

    +canPreventEnemyOccupyNoManCastle: boolean, // in progress
    +canPreventEnemyOccupyMyCastle: boolean, // in progress
    +canPreventEnemyOccupyMyTeamCastle: boolean, // in progress
|};

const defaultRawRate: RawRateType = {
    attack: {
        damageGiven: 0,
        damageReceived: 0,
        hitPoints: defaultUnitData.hitPoints,
    },
    unit: {
        endPosition: {
            x: -1,
            y: -1,
        },
        hitPoints: defaultUnitData.hitPoints,
    },
    placeArmor: 0,
    availableGivenDamage: 0,
    pathSizeToNearOccupyAbleBuilding: 0,
    isReachedNearOccupyAbleBuilding: false,
    pathSizeToNearHealsBuilding: 0,
    isReachedToNearHealsBuilding: false,
    canRaiseSkeleton: false,
    canFixFarm: false,
    canOccupyEnemyFarm: false,
    canOccupyNoManFarm: false,
    canDestroyEnemyFarm: false,
    canOccupyEnemyCastle: false,
    canOccupyNoManCastle: false,
    canPreventEnemyFixFarm: false,
    canPreventEnemyOccupyNoManFarm: false,
    canPreventEnemyOccupyMyFarm: false,
    canPreventEnemyOccupyMyTeamFarm: false,
    canPreventEnemyOccupyNoManCastle: false,
    canPreventEnemyOccupyMyCastle: false,
    canPreventEnemyOccupyMyTeamCastle: false,
};

function getEndPoint(botResultActionData: BotResultActionDataType): PointType {
    const {unit, moveAction} = botResultActionData;
    const {action} = moveAction;

    if (action) {
        return {
            x: action.to.x,
            y: action.to.y,
        };
    }

    const unitAttr = unit.getAttr();

    return {
        x: unitAttr.x,
        y: unitAttr.y,
    };
}

function getPlaceArmor(botResultActionData: BotResultActionDataType): number {
    const {unit, armorMap} = botResultActionData;
    const unitAttr = unit.getAttr();
    const currentUnitGuideData = unitGuideData[unitAttr.type];
    const {moveType} = currentUnitGuideData;
    const unitArmorMap =
        moveType === 'walk' || moveType === 'fly' || moveType === 'flow' ? armorMap[moveType] : armorMap.walk;
    const {x, y} = getEndPoint(botResultActionData);

    return unitArmorMap[y][x];
}

function getAvailableGivenDamage(
    botResultActionData: BotResultActionDataType,
    enemyUnitAllActionsMapList: Array<EnemyUnitAllAvailableActionsMapType>
): number {
    const {x, y} = getEndPoint(botResultActionData);
    let damage = 0;

    // one unit can attack only one time
    enemyUnitAllActionsMapList.forEach((enemyUnitAllAvailableActionsMap: EnemyUnitAllAvailableActionsMapType) => {
        const {damageMap} = enemyUnitAllAvailableActionsMap;
        const mapDamage = damageMap[y][x];

        if (typeof mapDamage === 'number' && mapDamage > 0) {
            damage += mapDamage;
        }
    });

    return damage;
}

function getRateBotResultAction(
    botResultActionData: BotResultActionDataType,
    enemyUnitAllActionsMapList: Array<EnemyUnitAllAvailableActionsMapType>
): RawRateType {
    let rawRate: RawRateType = JSON.parse(JSON.stringify(defaultRawRate));
    const {unitAction, unit} = botResultActionData;
    const currentHitPoints = unit.getHitPoints();
    const {x, y} = getEndPoint(botResultActionData);

    // rawRate.unit.endPosition.x, rawRate.unit.endPosition.y, rawRate.unit.hitPoints
    rawRate = {
        ...rawRate,
        unit: {
            ...rawRate.unit,
            endPosition: {
                ...rawRate.unit.endPosition,
                x,
                y,
            },
            hitPoints: currentHitPoints,
        },
    };

    // rawRate.attack.hitPoints
    rawRate = {
        ...rawRate,
        attack: {
            ...rawRate.attack,
            hitPoints: currentHitPoints,
        },
    };

    // rawRate.attack
    if (unitAction && unitAction.type === 'attack') {
        rawRate = {
            ...rawRate,
            attack: {
                damageGiven: unitAction.aggressor.damage.given,
                damageReceived: unitAction.aggressor.damage.received,
                hitPoints: unitAction.aggressor.hitPoints,
            },
        };
    }

    // rawRate.placeArmor
    rawRate = {
        ...rawRate,
        placeArmor: getPlaceArmor(botResultActionData),
    };

    // rawRate.availableGivenDamage
    rawRate = {
        ...rawRate,
        availableGivenDamage: getAvailableGivenDamage(botResultActionData, enemyUnitAllActionsMapList),
    };

    return rawRate;
}

function rateMoveAction(
    botResultActionData: BotResultActionDataType,
    enemyUnitAllActionsMapList: Array<EnemyUnitAllAvailableActionsMapType>
): number {
    console.log(getRateBotResultAction(botResultActionData, enemyUnitAllActionsMapList));

    return Math.random();
}

function rateMainAction(
    botResultActionData: BotResultActionDataType,
    enemyUnitAllActionsMapList: Array<EnemyUnitAllAvailableActionsMapType>
): number {
    console.log(getRateBotResultAction(botResultActionData, enemyUnitAllActionsMapList));

    return Math.random();
}

export function rateBotResultActionData(
    botResultActionData: BotResultActionDataType,
    enemyUnitAllActionsMapList: Array<EnemyUnitAllAvailableActionsMapType>
): number {
    const {unitAction} = botResultActionData;

    return unitAction === null ?
        rateMoveAction(botResultActionData, enemyUnitAllActionsMapList) :
        rateMainAction(botResultActionData, enemyUnitAllActionsMapList);
}
