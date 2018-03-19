// @flow
/* global fetch */

import appConst from './../app-const';
import type {MapType} from '../maps/type';

const {api} = appConst;
const {url} = api;

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


export type AllRoomSettingsType = {|
    map: MapType,
    defaultMoney: number,
    unitLimit: number
|};

export type SetAllRoomSettingsType = {|
    roomId: string
|};

export function setAllRoomSettings(roomId: string,
                                   allRoomSettings: AllRoomSettingsType): Promise<SetAllRoomSettingsType> {
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

export type GetAllRoomSettingsType = {|
    roomId: string,
    settings: AllRoomSettingsType
|};

export function getAllRoomSettings(roomId: string): Promise<GetAllRoomSettingsType> {
    return fetch(url + '/api/room/get-all-settings/' + roomId)
        .then((blob: Response): Promise<GetAllRoomSettingsType> => blob.json());
}
