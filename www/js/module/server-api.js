// @flow
/* global fetch */

import appConst from './../app-const';
import type {MapType} from '../maps/type';
import mapGuide from './../maps/map-guide';
import type {PathType} from './../components/game/model/unit/path-master';
import type {AttackResultUnitType} from '../components/game/model/helper';

const {api} = appConst;
const {url} = api;

export type ServerUserType = {|
    socketId: string,
    userId: string,
    teamId: string
|};

export type CreateRoomType = {|
    roomId: string
|};

export function createRoom(): Promise<CreateRoomType> {
    return fetch(url + '/api/room/create')
        .then((blob: Response): Promise<CreateRoomType> => blob.json())
        .then((result: CreateRoomType): CreateRoomType => ({
            roomId: typeof result.roomId === 'string' ? result.roomId : ''
        }));
}


export type JoinRoomType = {|
    roomId: string
|};

export function joinRoom(roomId: string, userId: string, socketId: string): Promise<JoinRoomType> {
    return fetch(url + '/api/room/join/' + [roomId, userId, socketId].join('/'))
        .then((blob: Response): Promise<JoinRoomType> => blob.json())
        .then((result: JoinRoomType): JoinRoomType => ({
            roomId: typeof result.roomId === 'string' ? result.roomId : ''
        }));
}


export type LeaveRoomType = {|
    roomId: string
|};

export function leaveRoom(roomId: string, userId: string): Promise<LeaveRoomType> {
    return fetch(url + '/api/room/leave/' + [roomId, userId].join('/'))
        .then((blob: Response): Promise<LeaveRoomType> => blob.json())
        .then((result: LeaveRoomType): LeaveRoomType => ({
            roomId: typeof result.roomId === 'string' ? result.roomId : ''
        }));
}


export type AllRoomSettingsType = {|
    map: MapType,
    defaultMoney: number,
    unitLimit: number,
    userList: Array<ServerUserType>
|};

export type SetAllRoomSettingsType = {|
    roomId: string
|};

export function setAllRoomSettings(roomId: string,
                                   allRoomSettings: AllRoomSettingsType): Promise<SetAllRoomSettingsType> {
    console.warn('---> use this method in room only, not in game or other views');

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
    console.warn('---> use this method in room only, not in game or other views');

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


export type GetAllRoomSettingsType = {|
    roomId: string,
    settings: AllRoomSettingsType
|};

export function getAllRoomSettings(roomId: string): Promise<GetAllRoomSettingsType> {
    return fetch(url + '/api/room/get-all-settings/' + roomId)
        .then((blob: Response): Promise<GetAllRoomSettingsType> => blob.json());
}


export type GetAllRoomUsersType = {|
    roomId: string,
    users: Array<ServerUserType>
|};

export function getAllRoomUsers(roomId: string): Promise<GetAllRoomUsersType> {
    return fetch(url + '/api/room/get-users/' + roomId)
        .then((blob: Response): Promise<GetAllRoomUsersType> => blob.json())
        .then((result: GetAllRoomUsersType): GetAllRoomUsersType => {
            const users = result.users.map((user: ServerUserType, userIndex: number): ServerUserType => {
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


export type GetAllRoomIdsType = {|
    +roomIds: Array<string>
|};

export function getAllRoomIds(): Promise<GetAllRoomIdsType> {
    return fetch(url + '/api/room/get-ids')
        .then((blob: Response): Promise<GetAllRoomIdsType> => blob.json());
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

export type PushedStatePayloadRefreshUnitListType = {|
    +type: 'refresh-unit-list',
    +map: MapType,
    +activeUserId: string
|};

export type PushedStatePayloadType = PushedStatePayloadIsGameStartedType
    | PushedStatePayloadUnitMoveType
    | PushedStatePayloadUnitAttackType
    | PushedStatePayloadRefreshUnitListType;

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

const lastPushedState = {};

export function pushState(roomId: string,
                          userId: string,
                          pushedState: PushedStateType): Promise<PushStateType> {
    const stateToPush = Object.assign({}, lastPushedState, pushedState);

    // update last pushed state
    Object.assign(lastPushedState, pushedState);

    return fetch(url + '/api/room/push-state/' + [roomId, userId].join('/'), {
        method: 'POST',
        body: JSON.stringify(stateToPush),
        headers: {Accept: 'application/json', 'Content-Type': 'application/json'}
    })
        .then((blob: Response): Promise<PushStateType> => blob.json());
    // .then((result: PushStateType): PushStateType => result);
}

export type TakeTurnType = {|
    roomId: string
|};

export function takeTurn(roomId: string,
                         userId: string): Promise<TakeTurnType> {
    return fetch(url + '/api/room/take-turn/' + [roomId, userId].join('/'))
        .then((blob: Response): Promise<TakeTurnType> => blob.json());
}

export type DropTurnType = {|
    roomId: string
|};

export function dropTurn(roomId: string,
                         userId: string): Promise<DropTurnType> {
    return fetch(url + '/api/room/drop-turn/' + [roomId, userId].join('/'))
        .then((blob: Response): Promise<DropTurnType> => blob.json());
}


