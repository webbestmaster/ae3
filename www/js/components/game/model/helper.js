// @flow

import type {ServerUserType} from '../../../module/server-api';
import mapGuide from './../../../maps/map-guide';
import type {UnitActionType, UnitActionsMapType, UnitActionMoveType} from './unit';
import {getPath, defaultOptions} from './../../../lib/a-star-finder';
import type {PathType, PointType} from './../../../lib/a-star-finder';

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
