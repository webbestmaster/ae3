// @flow

import type {MapUserType} from '../../../maps/type';
import {mapGuide} from '../../../maps/map-guide';
import type {UnitTypeCommanderType} from '../../game/model/unit/unit-guide';

export function getDefaultUserList(): Array<MapUserType> {
    return mapGuide.commanderList.map(
        (commanderName: UnitTypeCommanderType, index: number): MapUserType => ({
            userId: String(index),
            money: 0,
            teamId: mapGuide.teamIdList[index],
            isLeaved: false,
            commander: {
                type: commanderName,
                buyCount: 0,
            },
        })
    );
}
