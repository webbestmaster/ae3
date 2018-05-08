// @flow

// helpers
import type {AllRoomSettingsType, ServerUserType} from './../../module/server-api';
import * as serverApi from './../../module/server-api';
import type {BuildingType, MapType, UnitType} from './../../maps/type';

export type RoomDataType = {|
    roomId: string,
    settings: AllRoomSettingsType,
    userList: Array<ServerUserType>,
    maxUserSize: number
|};

export async function getRoomState(roomId: string): Promise<RoomDataType | null> { // eslint-disable-line complexity
    const getAllRoomSettingsResult = await serverApi.getAllRoomSettings(roomId);

    const map = getAllRoomSettingsResult.settings && getAllRoomSettingsResult.settings.map ?
        getAllRoomSettingsResult.settings.map :
        null;

    if (map === null) {
        return null;
    }

    const getAllRoomUsersResult = await serverApi.getAllRoomUsers(roomId);

    const userList = Array.isArray(getAllRoomUsersResult.users) ?
        getAllRoomUsersResult.users :
        null;

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

function getMaxUserListSize(map: MapType): number {
    const idList: Array<string> = [];

    map.units.forEach((unit: UnitType) => {
        if (typeof unit.userId === 'string' && !idList.includes(unit.userId)) {
            idList.push(unit.userId);
        }
    });

    map.buildings.forEach((building: BuildingType) => {
        if (typeof building.userId === 'string' && !idList.includes(building.userId)) {
            idList.push(building.userId);
        }
    });

    return idList.length;
}
