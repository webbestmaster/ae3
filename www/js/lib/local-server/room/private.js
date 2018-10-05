// @flow

import Stopwatch from 'timer-stopwatch';
import roomConfig from './config-data.js';
import {Room} from './room';

const timersConfig = roomConfig.timers;

export function bindTimers(room: Room) {
    const attr = room.getAttr();
    const {timers} = attr;

    // on create room
    const onCreateRoomTimer = new Stopwatch(timersConfig.onCreateRoom.time);

    timers.onCreateRoom = onCreateRoomTimer;

    onCreateRoomTimer.start();

    onCreateRoomTimer.onDone(() => {
        if (room.getConnections().length === 0) {
            room.destroy();
            return;
        }
        onCreateRoomTimer.stop();
    });
}
