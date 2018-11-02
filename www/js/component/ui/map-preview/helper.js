// @flow

import type {MapUserType} from '../../../maps/type';
import {mapGuide} from '../../../maps/map-guide';

export function getDefaultUserList(): Array<MapUserType> {
    return [0, 1, 2, 3].map(
        (index: number): MapUserType => ({
            userId: String(index),
            money: 0,
            teamId: mapGuide.teamIdList[index],
        })
    );
}
