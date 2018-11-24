// @flow

import type {BotResultActionDataType} from './bot';

type PointType = {|
    +x: number,
    +y: number,
|};

export type RawRateType = {|
    +attack: {|
        +damageGiven: number,
        +damageReceived: number,
    |},

    // use together: placeArmor and availableDamageGiven
    +placeArmor: number,
    +availableDamageGiven: number, // make enemy's damage map

    +currentHitPoints: number, // unit with bigger hp has priority, to attack and move on front

    /*
     *
     * castle or farm, will stimulate unit to move ahead
     * count path size to building (f. e. 4)
     * count map diagonal size (f. e. 13)
     * count diff - 13 - 4 = 9
     * nearest building has bigger diff
     *
     * */
    +pathSizeToNearOccupyAbleBuilding: number,
    +pathSizeToNearHealsBuilding: number, // use if unit has < 50hp

    +canRaiseSkeleton: boolean,

    // farm
    +canFixFarm: boolean,
    +canOccupyEnemyFarm: boolean,
    +canOccupyNoManFarm: boolean,
    +canDestroyEnemyFarm: boolean,
    // +canDestroyNoManFarm: boolean, // catapult can not destroy no man's farm

    // castle
    +canOccupyEnemyCastle: boolean,
    +canOccupyNoManCastle: boolean,
|};

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

function rateMoveAction(botResultActionData: BotResultActionDataType): number {
    return Math.random();
}

function rateMainAction(botResultActionData: BotResultActionDataType): number {
    return Math.random();
}

export function rateBotResultActionData(botResultActionData: BotResultActionDataType): number {
    const {unitAction} = botResultActionData;

    return unitAction === null ? rateMoveAction(botResultActionData) : rateMainAction(botResultActionData);
}
