// @flow

import type {BotResultActionDataType} from './bot';

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
