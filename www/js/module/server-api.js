// @flow
/* global fetch */

const url = 'http://localhost:3001';

export function createRoom(): Promise<{ roomId: string }> {
    return fetch(url + '/api/room/create').then(blob => blob.json());
}

export function joinRoom(roomId:string, userId:string, socketId:string): Promise<{ roomId: string }> {
    return fetch(url + '/api/room/join/' + [roomId, userId, socketId].join('/')).then(blob => blob.json());
}
