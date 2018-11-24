// @flow
/* global window, fetch */

import {appConst} from '../const';
import type {BuildingAttrTypeType, BuildingType, MapType, UnitType} from '../maps/type';
import {mapGuide} from '../maps/map-guide';
import type {PathType} from '../component/game/model/unit/path-master';
import type {AttackResultUnitType} from '../component/game/model/helper';
import {isOnLineRoomType} from '../component/game/model/helper';
import {localGet, localPost, localServerUrl} from './server-local-api';
import {localSocketIoClient} from './socket-local';
import {isString} from '../lib/is/is';
import type {SocketMessageType} from './socket';
import {socket} from './socket';
import isEqual from 'lodash/isEqual';

const {api} = appConst;
const {url} = api;

type ServerApiErrorType = {
    +error: {
        +id: string | number,
        +message: string,
    },
};

export type ServerUserType = {|
    socketId: string,
    userId: string,
    teamId?: string,
    type: 'human' | 'bot',
|};

export type RoomTypeType = 'on-line' | 'off-line';

export type CreateRoomType = {
    roomId: string,
};

const headers = {Accept: 'application/json', 'Content-Type': 'application/json'};

export function createRoom(): Promise<CreateRoomType> {
    if (isOnLineRoomType()) {
        return fetch(url + '/api/room/create')
            .then((blob: Response): Promise<CreateRoomType> => blob.json())
            .then(
                (result: CreateRoomType): CreateRoomType => ({
                    roomId: isString(result.roomId) ? result.roomId : '',
                })
            )
            .catch(
                (error: Error): CreateRoomType => {
                    console.error(error);
                    return {roomId: ''};
                }
            );
    }

    return localGet(localServerUrl + '/api/room/create').then((result: string): CreateRoomType => JSON.parse(result));
}

export type JoinRoomType = {
    roomId: string,
};

export function joinRoom(roomId: string, userId: string, socketId: string): Promise<JoinRoomType> {
    if (isOnLineRoomType()) {
        return fetch(url + '/api/room/join/' + [roomId, userId, socketId].join('/'))
            .then((blob: Response): Promise<JoinRoomType> => blob.json())
            .then(
                (result: JoinRoomType): JoinRoomType => ({
                    roomId: isString(result.roomId) ? result.roomId : '',
                })
            )
            .catch(
                (error: Error): JoinRoomType => {
                    console.error(error);
                    return {roomId: ''};
                }
            );
    }

    return localGet(localServerUrl + '/api/room/join/' + [roomId, userId, localSocketIoClient.id].join('/')).then(
        (result: string): JoinRoomType => JSON.parse(result)
    );
}

export function makeUser(type: 'human' | 'bot', roomId: string): Promise<JoinRoomType> {
    if (isOnLineRoomType()) {
        return fetch(url + '/api/room/make/' + type + '/' + roomId)
            .then((blob: Response): Promise<JoinRoomType> => blob.json())
            .then(
                (result: JoinRoomType): JoinRoomType => ({
                    roomId: isString(result.roomId) ? result.roomId : '',
                })
            );
    }

    return localGet(localServerUrl + '/api/room/make/' + type + '/' + roomId).then(
        (result: string): JoinRoomType => JSON.parse(result)
    );
}

export type LeaveRoomType = {
    roomId: string,
};

export function leaveRoom(roomId: string, userId: string): Promise<LeaveRoomType> {
    if (isOnLineRoomType()) {
        return fetch(url + '/api/room/leave/' + [roomId, userId].join('/'))
            .then((blob: Response): Promise<LeaveRoomType | ServerApiErrorType> => blob.json())
            .then(
                (result: LeaveRoomType | ServerApiErrorType): LeaveRoomType => {
                    if (typeof result.roomId === 'string') {
                        return {
                            roomId: result.roomId,
                        };
                    }

                    return {
                        roomId: '',
                    };
                }
            )
            .catch(
                (error: Error): LeaveRoomType => {
                    console.error(error);

                    return {
                        roomId: '',
                    };
                }
            );
    }

    return localGet(localServerUrl + '/api/room/leave/' + [roomId, userId].join('/')).then(
        (result: string): LeaveRoomType => {
            const parsedResult = JSON.parse(result);

            if (typeof parsedResult.roomId === 'string') {
                return {
                    roomId: parsedResult.roomId,
                };
            }

            return {
                roomId: '',
            };
        }
    );
}

export type AllRoomSettingsType = {|
    map: MapType,
    type: RoomTypeType,
    // defaultMoney: number,
    // unitLimit: number,
    // userList: Array<ServerUserType>
|};

export type SetAllRoomSettingsType = {
    roomId: string,
};

export function setAllRoomSettings(
    roomId: string,
    allRoomSettings: AllRoomSettingsType
): Promise<SetAllRoomSettingsType> {
    // WARNING: use this method in room only, not in game or other views
    if (isOnLineRoomType()) {
        return fetch(url + '/api/room/set-all-settings/' + roomId, {
            method: 'POST',
            body: JSON.stringify(allRoomSettings),
            headers,
        })
            .then((blob: Response): Promise<SetAllRoomSettingsType> => blob.json())
            .then(
                (result: SetAllRoomSettingsType): SetAllRoomSettingsType => ({
                    roomId: isString(result.roomId) ? result.roomId : '',
                })
            )
            .catch(
                (error: Error): SetAllRoomSettingsType => {
                    console.error(error);
                    return {roomId: ''};
                }
            );
    }

    return localPost(localServerUrl + '/api/room/set-all-settings/' + roomId, JSON.stringify(allRoomSettings)).then(
        (result: string): SetAllRoomSettingsType => JSON.parse(result)
    );
}

export type RoomSettingUserListType = {|
    userList: Array<ServerUserType>,
|};

export type RoomSettingMapType = {|
    map: MapType,
|};

export type SetRoomSettingType = {
    roomId: string,
};

export function setRoomSetting(
    roomId: string,
    roomSetting: RoomSettingUserListType | RoomSettingMapType
): Promise<SetRoomSettingType> {
    // WARNING: use this method in room only, not in game or other views
    if (isOnLineRoomType()) {
        return fetch(url + '/api/room/set-setting/' + roomId, {
            method: 'POST',
            body: JSON.stringify(roomSetting),
            headers,
        })
            .then((blob: Response): Promise<SetRoomSettingType> => blob.json())
            .then(
                (result: SetRoomSettingType): SetRoomSettingType => ({
                    roomId: isString(result.roomId) ? result.roomId : '',
                })
            );
    }

    return localPost(localServerUrl + '/api/room/set-setting/' + roomId, JSON.stringify(roomSetting)).then(
        (result: string): SetRoomSettingType => JSON.parse(result)
    );
}

export type GetAllRoomSettingsType = {
    roomId: string,
    settings: AllRoomSettingsType,
};

export function getAllRoomSettings(roomId: string): Promise<GetAllRoomSettingsType> {
    if (isOnLineRoomType()) {
        return fetch(url + '/api/room/get-all-settings/' + roomId).then(
            (blob: Response): Promise<GetAllRoomSettingsType> => blob.json()
        );
    }

    return localGet(localServerUrl + '/api/room/get-all-settings/' + roomId).then(
        (result: string): GetAllRoomSettingsType => JSON.parse(result)
    );
}

export type GetAllRoomUsersType = {
    roomId: string,
    users: Array<ServerUserType>,
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export function getAllRoomUsers(roomId: string): Promise<GetAllRoomUsersType> {
    if (isOnLineRoomType()) {
        return (
            fetch(url + '/api/room/get-users/' + roomId)
                .then((blob: Response): Promise<{roomId?: string, users?: Array<ServerUserType>}> => blob.json())
                // ServerApiErrorType can be fetched if game is over
                .then(
                    (result: {roomId?: string, users?: Array<ServerUserType>}): GetAllRoomUsersType => {
                        const serverUserList = Array.isArray(result.users) ? result.users : [];

                        if (Array.isArray(result.users) === false) {
                            console.log('getAllRoomUsers get no array', result);
                        }

                        const users = serverUserList.map(
                            // eslint-disable-next-line sonarjs/cognitive-complexity
                            (user: ServerUserType, userIndex: number): ServerUserType => {
                                return {
                                    socketId: user.socketId,
                                    userId: user.userId,
                                    teamId:
                                        typeof user.teamId === 'string' ? user.teamId : mapGuide.teamIdList[userIndex],
                                    type: user.type,
                                };
                            }
                        );

                        return {
                            roomId: typeof result.roomId === 'string' ? result.roomId : '',
                            users,
                        };
                    }
                )
        );
    }

    return localGet(localServerUrl + '/api/room/get-users/' + roomId)
        .then((result: string): GetAllRoomUsersType => JSON.parse(result))
        .then(
            (result: GetAllRoomUsersType): GetAllRoomUsersType => {
                const serverUserList = Array.isArray(result.users) ? result.users : [];

                if (Array.isArray(result.users) === false) {
                    console.log('getAllRoomUsers get no array', result);
                }

                const users = serverUserList.map(
                    // eslint-disable-next-line sonarjs/cognitive-complexity
                    (user: ServerUserType, userIndex: number): ServerUserType => {
                        return {
                            socketId: localSocketIoClient.id,
                            userId: user.userId,
                            teamId: typeof user.teamId === 'string' ? user.teamId : mapGuide.teamIdList[userIndex],
                            type: user.type,
                        };
                    }
                );

                return {
                    roomId: result.roomId,
                    users,
                };
            }
        );
}

export type GetAllRoomIdsType = {
    +roomIds: Array<string>,
};

export function getAllRoomIds(): Promise<GetAllRoomIdsType> {
    if (isOnLineRoomType()) {
        return fetch(url + '/api/room/get-ids').then((blob: Response): Promise<GetAllRoomIdsType> => blob.json());
    }

    return localGet(localServerUrl + '/api/room/get-ids').then(
        (result: string): GetAllRoomIdsType => JSON.parse(result)
    );
}

type PushedStatePayloadIsGameStartedType = {|
    +isGameStart: boolean,
    +activeUserId: string,
    +map: MapType,
|};

export type PushedStatePayloadUnitMoveType = {|
    +type: 'move',
    +path: PathType,
    +from: {|
        +x: number,
        +y: number,
    |},
    +to: {|
        +x: number,
        +y: number,
    |},
    +unit: {|
        +id: string,
    |},
    +map: MapType,
    +activeUserId: string,
|};

export type PushedStatePayloadUnitAttackType = {|
    +type: 'attack',
    +aggressor: AttackResultUnitType,
    +defender: AttackResultUnitType,
    +map: MapType,
    +activeUserId: string,
|};

export type PushedStatePayloadFixBuildingType = {|
    +type: 'fix-building',
    +building: BuildingType,
    +map: MapType,
    +activeUserId: string,
|};

export type PushedStatePayloadOccupyBuildingType = {|
    +type: 'occupy-building',
    +building: BuildingType,
    +map: MapType,
    +activeUserId: string,
|};

export type PushedStatePayloadRaiseSkeletonType = {|
    +type: 'raise-skeleton',
    +raiser: {|
        +x: number,
        +y: number,
        +id: string,
        +userId: string,
        +newUnitId: string,
    |},
    +grave: {|
        +x: number,
        +y: number,
    |},
    +map: MapType,
    +activeUserId: string,
|};

export type PushedStatePayloadDestroyBuildingType = {|
    +type: 'destroy-building',
    +destroyer: {|
        +x: number,
        +y: number,
        +id: string,
        +userId: string,
    |},
    +building: {|
        +x: number,
        +y: number,
        +type: BuildingAttrTypeType,
        +id: string,
    |},
    +map: MapType,
    +activeUserId: string,
|};

export type PushedStatePayloadRefreshUnitListType = {|
    +type: 'refresh-unit-list',
    +map: MapType,
    +activeUserId: string,
|};

export type PushedStatePayloadBuyUnitType = {|
    +type: 'buy-unit',
    +newMapUnit: UnitType,
    +map: MapType,
    +activeUserId: string,
|};

export type PushedStatePayloadSyncMapWithServerUserListType = {|
    +type: 'sync-map-with-server-user-list',
    +map: MapType,
    +activeUserId: string,
|};

export type PushedStateRemoveUserType = {|
    +type: 'remove-user',
    +map: MapType,
    +userId: string,
|};

export type PushedStatePayloadType =
    | PushedStatePayloadIsGameStartedType
    | PushedStatePayloadUnitMoveType
    | PushedStatePayloadUnitAttackType
    | PushedStatePayloadRefreshUnitListType
    | PushedStatePayloadFixBuildingType
    | PushedStatePayloadOccupyBuildingType
    | PushedStatePayloadRaiseSkeletonType
    | PushedStatePayloadDestroyBuildingType
    | PushedStatePayloadBuyUnitType
    | PushedStatePayloadSyncMapWithServerUserListType
    | PushedStateRemoveUserType;

export type PushStateType = {
    roomId: string,
    type: 'room__push-state',
    states: {
        last: {
            state: PushedStatePayloadType,
            type: 'room__push-state',
        },
        length: number,
    },
};

export type PushedStateType = {|
    type: 'room__push-state',
    state: PushedStatePayloadType,
|};

function waitForSocketMessage(pushedState: PushedStateType): Promise<void> {
    return new Promise((resolve: () => void) => {
        function checkMessageCallBack(message: SocketMessageType | void) {
            if (!message) {
                console.error('waitForSocketMessage - checkMessageCallBack - SocketMessage is not define');
                return;
            }

            if (typeof message.states.last.state === 'undefined') {
                console.warn('waitForSocketMessage - checkMessageCallBack - message has no last.state');
                return;
            }

            if (!isEqual(message.states.last.state, pushedState.state)) {
                console.warn('waitForSocketMessage - checkMessageCallBack - need wait for needed message');
                return;
            }

            if (isOnLineRoomType()) {
                console.log(
                    'waitForSocketMessage - checkMessageCallBack - before off',
                    socket.attr.model.listeners.message.length
                );
                socket.attr.model.offChange('message', checkMessageCallBack);
                console.log(
                    'waitForSocketMessage - checkMessageCallBack - after off',
                    socket.attr.model.listeners.message.length
                );
            } else {
                console.log(
                    'waitForSocketMessage - checkMessageCallBack - before off',
                    localSocketIoClient.attr.listenerList.length
                );
                localSocketIoClient.off('message', checkMessageCallBack);
                console.log(
                    'waitForSocketMessage - checkMessageCallBack - after off',
                    localSocketIoClient.attr.listenerList.length
                );
            }

            resolve();
        }

        if (isOnLineRoomType()) {
            console.log('waitForSocketMessage - before on', socket.attr.model.listeners.message.length);
            socket.attr.model.onChange('message', checkMessageCallBack);
            console.log('waitForSocketMessage - after on', socket.attr.model.listeners.message.length);
        } else {
            console.log('waitForSocketMessage - before on', localSocketIoClient.attr.listenerList.length);
            localSocketIoClient.on('message', checkMessageCallBack);
            console.log('waitForSocketMessage - after on', localSocketIoClient.attr.listenerList.length);
        }
    });
}

export function pushState(roomId: string, userId: string, pushedState: PushedStateType): Promise<PushStateType> {
    function messagePushState(): Promise<PushStateType> {
        if (isOnLineRoomType()) {
            return window
                .fetch(url + '/api/room/push-state/' + [roomId, userId].join('/'), {
                    method: 'POST',
                    body: JSON.stringify(pushedState),
                    headers,
                })
                .then((blob: Response): Promise<PushStateType> => blob.json());
        }
        return localPost(
            localServerUrl + '/api/room/push-state/' + [roomId, userId].join('/'),
            JSON.stringify(pushedState)
        ).then((result: string): PushStateType => JSON.parse(result));
    }

    const waitSocketMessagePromise = waitForSocketMessage(pushedState);
    const messagePushStateResult = messagePushState();

    return waitSocketMessagePromise.then((): Promise<PushStateType> => messagePushStateResult);
}

export type TakeTurnType = {
    roomId: string,
};

function waitForSocketMessageTakeTurn(userId: string): Promise<void> {
    return new Promise((resolve: () => void) => {
        function checkMessageCallBack(message: SocketMessageType | void) {
            if (!message) {
                console.error('waitForSocketMessageTakeTurn - checkMessageCallBack - SocketMessage is not define');
                return;
            }

            if (message.states.last.activeUserId !== userId) {
                console.warn('waitForSocketMessageTakeTurn - checkMessageCallBack - activeUserId is wrong');
                return;
            }

            if (isOnLineRoomType()) {
                console.log(
                    'waitForSocketMessageTakeTurn - checkMessageCallBack - before off',
                    socket.attr.model.listeners.message.length
                );
                socket.attr.model.offChange('message', checkMessageCallBack);
                console.log(
                    'waitForSocketMessageTakeTurn - checkMessageCallBack - after off',
                    socket.attr.model.listeners.message.length
                );
            } else {
                console.log(
                    'waitForSocketMessageTakeTurn - checkMessageCallBack - before off',
                    localSocketIoClient.attr.listenerList.length
                );
                localSocketIoClient.off('message', checkMessageCallBack);
                console.log(
                    'waitForSocketMessageTakeTurn - checkMessageCallBack - after off',
                    localSocketIoClient.attr.listenerList.length
                );
            }

            resolve();
        }

        if (isOnLineRoomType()) {
            console.log('waitForSocketMessageTakeTurn - before on', socket.attr.model.listeners.message.length);
            socket.attr.model.onChange('message', checkMessageCallBack);
            console.log('waitForSocketMessageTakeTurn - after on', socket.attr.model.listeners.message.length);
        } else {
            console.log('waitForSocketMessageTakeTurn - before on', localSocketIoClient.attr.listenerList.length);
            localSocketIoClient.on('message', checkMessageCallBack);
            console.log('waitForSocketMessageTakeTurn - after on', localSocketIoClient.attr.listenerList.length);
        }
    });
}

export function takeTurn(roomId: string, userId: string): Promise<TakeTurnType> {
    function messageTakeTurn(): Promise<TakeTurnType> {
        if (isOnLineRoomType()) {
            return fetch(url + '/api/room/take-turn/' + [roomId, userId].join('/')).then(
                (blob: Response): Promise<TakeTurnType> => blob.json()
            );
        }

        return localGet(localServerUrl + '/api/room/take-turn/' + [roomId, userId].join('/')).then(
            (result: string): TakeTurnType => JSON.parse(result)
        );
    }

    const waitSocketTakeTurnPromise = waitForSocketMessageTakeTurn(userId);
    const messageTakeTurnResult = messageTakeTurn();

    return waitSocketTakeTurnPromise.then((): Promise<TakeTurnType> => messageTakeTurnResult);
}

export type DropTurnType = {
    roomId: string,
};

function waitForSocketMessageDropTurn(userId: string): Promise<void> {
    return new Promise((resolve: () => void) => {
        function checkMessageCallBack(message: SocketMessageType | void) {
            if (!message) {
                console.error('waitForSocketMessageDropTurn - checkMessageCallBack - is not define');
                return;
            }

            if (message.states.last.activeUserId === userId) {
                console.warn('waitForSocketMessageDropTurn - checkMessageCallBack - activeUserId is wrong');
                return;
            }

            if (isOnLineRoomType()) {
                console.log(
                    'waitForSocketMessageDropTurn - checkMessageCallBack - before off',
                    socket.attr.model.listeners.message.length
                );
                socket.attr.model.offChange('message', checkMessageCallBack);
                console.log(
                    'waitForSocketMessageDropTurn - checkMessageCallBack - after off',
                    socket.attr.model.listeners.message.length
                );
            } else {
                console.log(
                    'waitForSocketMessageDropTurn - checkMessageCallBack - before off',
                    localSocketIoClient.attr.listenerList.length
                );
                localSocketIoClient.off('message', checkMessageCallBack);
                console.log(
                    'waitForSocketMessageDropTurn - checkMessageCallBack - after off',
                    localSocketIoClient.attr.listenerList.length
                );
            }

            resolve();
        }

        if (isOnLineRoomType()) {
            console.log('waitForSocketMessageDropTurn - before on', socket.attr.model.listeners.message.length);
            socket.attr.model.onChange('message', checkMessageCallBack);
            console.log('waitForSocketMessageDropTurn - after on', socket.attr.model.listeners.message.length);
        } else {
            console.log('waitForSocketMessageDropTurn - before on', localSocketIoClient.attr.listenerList.length);
            localSocketIoClient.on('message', checkMessageCallBack);
            console.log('waitForSocketMessageDropTurn - after on', localSocketIoClient.attr.listenerList.length);
        }
    });
}

export function dropTurn(roomId: string, userId: string): Promise<DropTurnType> {
    function messageDropTurn(): Promise<DropTurnType> {
        if (isOnLineRoomType()) {
            return fetch(url + '/api/room/drop-turn/' + [roomId, userId].join('/')).then(
                (blob: Response): Promise<DropTurnType> => blob.json()
            );
        }

        return localGet(localServerUrl + '/api/room/drop-turn/' + [roomId, userId].join('/')).then(
            (result: string): DropTurnType => JSON.parse(result)
        );
    }

    const waitSocketDropTurnPromise = waitForSocketMessageDropTurn(userId);
    const messageDropTurnResult = messageDropTurn();

    return waitSocketDropTurnPromise.then((): Promise<DropTurnType> => messageDropTurnResult);
}
