// @flow

import type {BotResultActionDataType} from './bot';

type PointType = {|
    +x: number,
    +y: number,
|};

export type RawRateType = {|
    +placeArmor: number,
    +attack: {|
        +damageGiven: number,
        +damageReceived: number,
    |},

    +pathSizeToNearNoOccupiedBuilding: number, // castle or farm, less better, will stimulate unit to move ahead
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
