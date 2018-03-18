// @flow
/* global fetch */

import appConst from './../app-const';

const {api} = appConst;
const {url} = api;

export type CreateRoomType = {|
    roomId: string
|};

export function createRoom(): Promise<CreateRoomType> {
    return fetch(url + '/api/room/create').then(blob => blob.json());
}

/*
export function joinRoom(roomId: string, userId: string, socketId: string): Promise<{ roomId: string }> {
    return fetch(url + '/api/room/join/' + [roomId, userId, socketId].join('/')).then(blob => blob.json());
}
*/
