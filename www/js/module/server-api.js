// @flow
/* global fetch */

import appConst from './../app-const';
import type {BuildingAttrTypeType, BuildingType, MapType, UnitType} from './../maps/type';
import mapGuide from './../maps/map-guide';
import type {PathType} from './../components/game/model/unit/path-master';
import type {AttackResultUnitType} from './../components/game/model/helper';
import {isOnLineRoomType} from './../components/game/model/helper';
import {localGet, localPost, localServerUrl} from './server-local-api';
import {localSocketIoClient} from './socket-local';

const {api} = appConst;
const {url} = api;

export type ServerUserType = {|
    socketId: string,
    userId: string,
    teamId: string
|};

export type RoomTypeType = 'on-line' | 'off-line';


export type CreateRoomType = {|
    roomId: string
|};

export function createRoom(): Promise<CreateRoomType> {
    if (isOnLineRoomType()) {
        return fetch(url + '/api/room/create')
            .then((blob: Response): Promise<CreateRoomType> => blob.json())
            .then((result: CreateRoomType): CreateRoomType => ({
                roomId: typeof result.roomId === 'string' ? result.roomId : ''
            }));
    }

    return localGet(localServerUrl + '/api/room/create')
        .then((result: string): CreateRoomType => JSON.parse(result));
}


export type JoinRoomType = {|
    roomId: string
|};

export function joinRoom(roomId: string, userId: string, socketId: string): Promise<JoinRoomType> {
    if (isOnLineRoomType()) {
        return fetch(url + '/api/room/join/' + [roomId, userId, socketId].join('/'))
            .then((blob: Response): Promise<JoinRoomType> => blob.json())
            .then((result: JoinRoomType): JoinRoomType => ({
                roomId: typeof result.roomId === 'string' ? result.roomId : ''
            }));
    }

    return localGet(localServerUrl + '/api/room/join/' + [roomId, userId, localSocketIoClient.id].join('/'))
        .then((result: string): JoinRoomType => JSON.parse(result));
}


export type LeaveRoomType = {|
    roomId: string
|};

export function leaveRoom(roomId: string, userId: string): Promise<LeaveRoomType> {
    if (isOnLineRoomType()) {
        return fetch(url + '/api/room/leave/' + [roomId, userId].join('/'))
            .then((blob: Response): Promise<LeaveRoomType> => blob.json())
            .then((result: LeaveRoomType): LeaveRoomType => ({
                roomId: typeof result.roomId === 'string' ? result.roomId : ''
            }));
    }

    return localGet(localServerUrl + '/api/room/leave/' + [roomId, userId].join('/'))
        .then((result: string): LeaveRoomType => JSON.parse(result));
}


export type AllRoomSettingsType = {|
    map: MapType,
    type: RoomTypeType
    // defaultMoney: number,
    // unitLimit: number,
    // userList: Array<ServerUserType>
|};

export type SetAllRoomSettingsType = {|
    roomId: string
|};

export function setAllRoomSettings(roomId: string,
                                   allRoomSettings: AllRoomSettingsType): Promise<SetAllRoomSettingsType> {
    // WARNING: use this method in room only, not in game or other views
    if (isOnLineRoomType()) {
        return fetch(url + '/api/room/set-all-settings/' + roomId, {
            method: 'POST',
            body: JSON.stringify(allRoomSettings),
            headers: {Accept: 'application/json', 'Content-Type': 'application/json'}
        })
            .then((blob: Response): Promise<SetAllRoomSettingsType> => blob.json())
            .then((result: SetAllRoomSettingsType): SetAllRoomSettingsType => ({
                roomId: typeof result.roomId === 'string' ? result.roomId : ''
            }));
    }

    return localPost(localServerUrl + '/api/room/set-all-settings/' + roomId, JSON.stringify(allRoomSettings))
        .then((result: string): SetAllRoomSettingsType => JSON.parse(result));
}

export type RoomSettingUserListType = {|
    userList: Array<ServerUserType>
|};

export type RoomSettingMapType = {|
    map: MapType
|};

export type SetRoomSettingType = {|
    roomId: string
|};

export function setRoomSetting(roomId: string,
                               roomSetting: RoomSettingUserListType | RoomSettingMapType): Promise<SetRoomSettingType> {
    // WARNING: use this method in room only, not in game or other views
    if (isOnLineRoomType()) {
        return fetch(url + '/api/room/set-setting/' + roomId, {
            method: 'POST',
            body: JSON.stringify(roomSetting),
            headers: {Accept: 'application/json', 'Content-Type': 'application/json'}
        })
            .then((blob: Response): Promise<SetRoomSettingType> => blob.json())
            .then((result: SetRoomSettingType): SetRoomSettingType => ({
                roomId: typeof result.roomId === 'string' ? result.roomId : ''
            }));
    }

    return localPost(localServerUrl + '/api/room/set-setting/' + roomId, JSON.stringify(roomSetting))
        .then((result: string): SetRoomSettingType => JSON.parse(result));
}


export type GetAllRoomSettingsType = {|
    roomId: string,
    settings: AllRoomSettingsType
|};

export function getAllRoomSettings(roomId: string): Promise<GetAllRoomSettingsType> {
    if (isOnLineRoomType()) {
        return fetch(url + '/api/room/get-all-settings/' + roomId)
            .then((blob: Response): Promise<GetAllRoomSettingsType> => blob.json());
    }

    return localGet(localServerUrl + '/api/room/get-all-settings/' + roomId)
        .then((result: string): GetAllRoomSettingsType => JSON.parse(result));
}


export type GetAllRoomUsersType = {|
    roomId: string,
    users: Array<ServerUserType>
|};

export function getAllRoomUsers(roomId: string): Promise<GetAllRoomUsersType> {
    if (isOnLineRoomType()) {
        return fetch(url + '/api/room/get-users/' + roomId)
            .then((blob: Response): Promise<GetAllRoomUsersType> => blob.json())
            .then((result: GetAllRoomUsersType): GetAllRoomUsersType => {
                const serverUserList = Array.isArray(result.users) ? result.users : [];

                if (Array.isArray(result.users) === false) {
                    console.log('getAllRoomUsers get no array', result);
                }

                const users = serverUserList.map((user: ServerUserType, userIndex: number): ServerUserType => {
                    return {
                        socketId: user.socketId,
                        userId: user.userId,
                        teamId: user.teamId || mapGuide.teamIdList[userIndex]
                    };
                });

                return {
                    roomId: result.roomId,
                    users
                };
            });
    }

    return localGet(localServerUrl + '/api/room/get-users/' + roomId)
        .then((result: string): GetAllRoomUsersType => JSON.parse(result))
        .then((result: GetAllRoomUsersType): GetAllRoomUsersType => {
            const serverUserList = Array.isArray(result.users) ? result.users : [];

            if (Array.isArray(result.users) === false) {
                console.log('getAllRoomUsers get no array', result);
            }

            const users = serverUserList.map((user: ServerUserType, userIndex: number): ServerUserType => {
                return {
                    socketId: localSocketIoClient.id,
                    userId: user.userId,
                    teamId: user.teamId || mapGuide.teamIdList[userIndex]
                };
            });

            return {
                roomId: result.roomId,
                users
            };
        });
}


export type GetAllRoomIdsType = {|
    +roomIds: Array<string>
|};

export function getAllRoomIds(): Promise<GetAllRoomIdsType> {
    if (isOnLineRoomType()) {
        return fetch(url + '/api/room/get-ids')
            .then((blob: Response): Promise<GetAllRoomIdsType> => blob.json());
    }

    return localGet(localServerUrl + '/api/room/get-ids')
        .then((result: string): GetAllRoomIdsType => JSON.parse(result));
}

type PushedStatePayloadIsGameStartedType = {|
    +isGameStart: boolean,
    +activeUserId: string,
    +map: MapType
|};

export type PushedStatePayloadUnitMoveType = {|
    +type: 'move',
    +path: PathType,
    +from: {|
        +x: number,
        +y: number
    |},
    +to: {|
        +x: number,
        +y: number
    |},
    +unit: {|
        +id: string
    |},
    +map: MapType,
    +activeUserId: string
|};

export type PushedStatePayloadUnitAttackType = {|
    +type: 'attack',
    +aggressor: AttackResultUnitType,
    +defender: AttackResultUnitType,
    +map: MapType,
    +activeUserId: string
|};

export type PushedStatePayloadFixBuildingType = {|
    +type: 'fix-building',
    +building: BuildingType,
    +map: MapType,
    +activeUserId: string
|};

export type PushedStatePayloadOccupyBuildingType = {|
    +type: 'occupy-building',
    +building: BuildingType,
    +map: MapType,
    +activeUserId: string
|};

export type PushedStatePayloadRaiseSkeletonType = {|
    +type: 'raise-skeleton',
    +raiser: {|
        +x: number,
        +y: number,
        +id: string,
        +userId: string,
        +newUnitId: string
    |},
    +grave: {|
        +x: number,
        +y: number
    |},
    +map: MapType,
    +activeUserId: string
|};

export type PushedStatePayloadDestroyBuildingType = {|
    +type: 'destroy-building',
    +destroyer: {|
        +x: number,
        +y: number,
        +id: string,
        +userId: string
    |},
    +building: {|
        +x: number,
        +y: number,
        +type: BuildingAttrTypeType,
        +id: string
    |},
    +map: MapType,
    +activeUserId: string
|};

export type PushedStatePayloadRefreshUnitListType = {|
    +type: 'refresh-unit-list',
    +map: MapType,
    +activeUserId: string
|};

export type PushedStatePayloadBuyUnitType = {|
    +type: 'buy-unit',
    +newMapUnit: UnitType,
    +map: MapType,
    +activeUserId: string
|};

export type PushedStatePayloadSyncMapWithServerUserListType = {|
    +type: 'sync-map-with-server-user-list',
    +map: MapType,
    +activeUserId: string
|};

export type PushedStatePayloadType = PushedStatePayloadIsGameStartedType
    | PushedStatePayloadUnitMoveType
    | PushedStatePayloadUnitAttackType
    | PushedStatePayloadRefreshUnitListType
    | PushedStatePayloadFixBuildingType
    | PushedStatePayloadOccupyBuildingType
    | PushedStatePayloadRaiseSkeletonType
    | PushedStatePayloadDestroyBuildingType
    | PushedStatePayloadBuyUnitType
    | PushedStatePayloadSyncMapWithServerUserListType;

export type PushStateType = {|
    roomId: string,
    type: 'room__push-state',
    states: {
        last: {
            state: PushedStatePayloadType,
            type: 'room__push-state'
        },
        length: number
    }
|};

export type PushedStateType = {|
    type: 'room__push-state',
    state: PushedStatePayloadType
|};

// const lastPushedState = {};
/*
    const stateToPush = Object.assign({}, lastPushedState, pushedState);

    // update last pushed state
    Object.assign(lastPushedState, pushedState);
*/
export function pushState(roomId: string,
                          userId: string,
                          pushedState: PushedStateType): Promise<PushStateType> {
    if (isOnLineRoomType()) {
        return fetch(url + '/api/room/push-state/' + [roomId, userId].join('/'), {
            method: 'POST',
            body: JSON.stringify(pushedState),
            headers: {Accept: 'application/json', 'Content-Type': 'application/json'}
        })
            .then((blob: Response): Promise<PushStateType> => blob.json());
    }

    return localPost(localServerUrl + '/api/room/push-state/' + [roomId, userId].join('/'), JSON.stringify(pushedState))
        .then((result: string): PushStateType => JSON.parse(result));
}

export type TakeTurnType = {|
    roomId: string
|};

export function takeTurn(roomId: string,
                         userId: string): Promise<TakeTurnType> {
    if (isOnLineRoomType()) {
        return fetch(url + '/api/room/take-turn/' + [roomId, userId].join('/'))
            .then((blob: Response): Promise<TakeTurnType> => blob.json());
    }

    return localGet(localServerUrl + '/api/room/take-turn/' + [roomId, userId].join('/'))
        .then((result: string): TakeTurnType => JSON.parse(result));
}

export type DropTurnType = {|
    roomId: string
|};

export function dropTurn(roomId: string,
                         userId: string): Promise<DropTurnType> {
    if (isOnLineRoomType()) {
        return fetch(url + '/api/room/drop-turn/' + [roomId, userId].join('/'))
            .then((blob: Response): Promise<DropTurnType> => blob.json());
    }

    return localGet(localServerUrl + '/api/room/drop-turn/' + [roomId, userId].join('/'))
        .then((result: string): DropTurnType => JSON.parse(result));
}
