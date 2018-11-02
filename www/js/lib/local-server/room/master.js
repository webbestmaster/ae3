// @flow

/* eslint consistent-this: ["error", "roomMasterModel"] */

import find from 'lodash/find';

import {Room} from './room';

type AttrType = {|
    +rooms: Array<Room>
|};

export class RoomMaster {
    // eslint-disable-next-line no-underscore-dangle, id-match
    _attr: AttrType;
    constructor() {
        const roomMasterModel = this;

        // eslint-disable-next-line no-underscore-dangle, id-match
        roomMasterModel._attr = {
            rooms: [],
        };
    }

    push(room: Room) {
        const roomMasterModel = this;
        const rooms = roomMasterModel.getRooms();

        rooms.push(room);
    }

    removeRoomById(roomId: string) {
        const roomMasterModel = this;
        const rooms = roomMasterModel.getRooms();

        const roomToRemove = find(rooms, (room: Room): boolean => room.getId() === roomId);

        if (!roomToRemove) {
            console.log('WARNING ---> room is not exists, room id is: ' + roomId);
            return;
        }

        const roomToRemoveIndex = rooms.indexOf(roomToRemove);

        rooms.splice(roomToRemoveIndex, 1);
    }

    getRoomById(roomId: string): Room | null {
        const roomMasterModel = this;
        const rooms = roomMasterModel.getRooms();

        return find(rooms, (room: Room): boolean => room.getId() === roomId) || null;
    }

    getRoomIds(): Array<string> {
        const roomMasterModel = this;
        const rooms = roomMasterModel.getRooms();

        return rooms.map((room: Room): string => room.getId());
    }

    getRooms(): Array<Room> {
        return this.getAttr().rooms;
    }

    getAttr(): AttrType {
        // eslint-disable-next-line no-underscore-dangle, id-match
        return this._attr;
    }

    destroy() {
        const roomMasterModel = this;
        const attr = roomMasterModel.getAttr();
        const {rooms} = attr;

        // eslint-disable-next-line no-loops/no-loops
        while (rooms.length) {
            rooms[rooms.length - 1].destroy();
        }

        if (roomMasterModel.getAttr().rooms.length !== 0) {
            console.error('--- ERROR ---> roomMasterModel.getAttr().rooms.length !== 0');
        }
    }
}

export const roomMaster = new RoomMaster();
