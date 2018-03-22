// @flow

import type {ServerUserType} from '../../../module/server-api';
import mapGuide from './../../../maps/map-guide';

export function getUserIndex(userId: string, userList: Array<ServerUserType>): number {
    let userIndex = 0;
    const maxIndex = 4;

    while (userList[userIndex].userId !== userId && userIndex < maxIndex) {
        userIndex += 1;
    }

    if (userIndex === maxIndex) {
        return -1;
    }

    return userIndex;
}

export function getUserColor(userId: string, userList: Array<ServerUserType>): string {
    return mapGuide.colorList[getUserIndex(userId, userList)] || 'gray';
}
