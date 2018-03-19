// @flow
/* global fetch */

import appConst from './../app-const';

const {api} = appConst;
const {url} = api;

export type CreateRoomType = {|
    roomId: string | null
|};

export function createRoom(): Promise<CreateRoomType> {
    return fetch(url + '/api/room/create')
        .then((blob: Response): Promise<CreateRoomType> => blob.json())
        .then((result: CreateRoomType): CreateRoomType => ({
            roomId: typeof result.roomId === 'string' ? result.roomId : null
        }));
}

/*
export function joinRoom(roomId: string, userId: string, socketId: string): Promise<{ roomId: string }> {
    return fetch(url + '/api/room/join/' + [roomId, userId, socketId].join('/')).then(blob => blob.json());
}
*/
