// @flow

import type {BotResultActionDataType} from './bot';
import {defaultUnitData, unitGuideData} from './unit/unit-guide';

type PointType = {|
    +x: number,
    +y: number,
|};

export type RawRateType = {|
    +attack: {|
        +damageGiven: number, // done
        +damageReceived: number, // done
        +hitPoints: number, // done
    |},

    // use together: placeArmor and availableDamageGiven
    +placeArmor: number, // done
    +availableDamageGiven: number, // in progress // make enemy's damage map

    +currentHitPoints: number, // in progress // unit with bigger hp has priority, to attack and move on front

    /*
     *
     * castle or farm, will stimulate unit to move ahead
     * count path size to building (f. e. 4)
     * count map diagonal size (f. e. 13)
     * count diff - 13 - 4 = 9
     * nearest building has bigger diff
     *
     * */
    +pathSizeToNearOccupyAbleBuilding: number, // in progress
    +pathSizeToNearHealsBuilding: number, // in progress // use if unit has < 50hp

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
|};

const defaultRawRate: RawRateType = {
    attack: {
        damageGiven: 0,
        damageReceived: 0,
        hitPoints: defaultUnitData.hitPoints,
    },
    placeArmor: 0,
    availableDamageGiven: 0,
    currentHitPoints: 0,
    pathSizeToNearOccupyAbleBuilding: 0,
    pathSizeToNearHealsBuilding: 0,
    canRaiseSkeleton: false,
    canFixFarm: false,
    canOccupyEnemyFarm: false,
    canOccupyNoManFarm: false,
    canDestroyEnemyFarm: false,
    canOccupyEnemyCastle: false,
    canOccupyNoManCastle: false,
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

function getRateBotResultAction(botResultActionData: BotResultActionDataType): RawRateType {
    let rawRate: RawRateType = JSON.parse(JSON.stringify(defaultRawRate));
    const {unitAction, unit} = botResultActionData;

    // rawRate.attack.hitPoints
    rawRate = {
        ...rawRate,
        attack: {
            ...rawRate.attack,
            hitPoints: unit.getHitPoints(),
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

    return rawRate;
}

function rateMoveAction(botResultActionData: BotResultActionDataType): number {
    console.log(getRateBotResultAction(botResultActionData));

    return Math.random();
}

function rateMainAction(botResultActionData: BotResultActionDataType): number {
    console.log(getRateBotResultAction(botResultActionData));

    return Math.random();
}

export function rateBotResultActionData(botResultActionData: BotResultActionDataType): number {
    const {unitAction} = botResultActionData;

    return unitAction === null ? rateMoveAction(botResultActionData) : rateMainAction(botResultActionData);
}
