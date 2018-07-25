// @flow

// helpers
import type {AllRoomSettingsType, ServerUserType} from './../../module/server-api';
import * as serverApi from './../../module/server-api';
import type {BuildingType, MapType, UnitType} from './../../maps/type';
import {
    isBoolean,
    isNumber,
    isString,
    isFunction,
    isNotBoolean,
    isNotNumber,
    isNotString,
    isNotFunction
} from './../../lib/is';

export type RoomDataType = {|
    roomId: string,
    settings: AllRoomSettingsType,
    userList: Array<ServerUserType>,
    maxUserSize: number
|};

// eslint-disable-next-line complexity
export async function getRoomState(roomId: string): Promise<RoomDataType | null> {
    const getAllRoomSettingsResult = await serverApi.getAllRoomSettings(roomId);

    const map =
        getAllRoomSettingsResult.settings && getAllRoomSettingsResult.settings.map ?
            getAllRoomSettingsResult.settings.map :
            null;

    if (map === null) {
        return null;
    }

    const getAllRoomUsersResult = await serverApi.getAllRoomUsers(roomId);

    const userList = Array.isArray(getAllRoomUsersResult.users) ? getAllRoomUsersResult.users : null;

    if (userList === null) {
        return null;
    }

    return {
        roomId,
        settings: getAllRoomSettingsResult.settings,
        userList,
        maxUserSize: getMaxUserListSize(map)
    };
}

export function getMaxUserListSize(map: MapType): number {
    const idList: Array<string> = [];

    map.units.forEach((unit: UnitType) => {
        if (isString(unit.userId) && !idList.includes(unit.userId)) {
            idList.push(unit.userId);
        }
    });

    map.buildings.forEach((building: BuildingType) => {
        if (isString(building.userId) && !idList.includes(building.userId)) {
            idList.push(building.userId);
        }
    });

    return idList.length;
}
