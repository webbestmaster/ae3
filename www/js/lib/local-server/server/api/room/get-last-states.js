// @flow

import {roomMaster} from '../../../room/master';
import {LocalExpressRequest} from '../../../local-express/request';
import {LocalExpressResponse} from '../../../local-express/response';
import {error} from '../error';

export function getLastStates(req: LocalExpressRequest, res: LocalExpressResponse) {
    const {params} = req;
    const {roomId, count} = params;

    const room = roomMaster.getRoomById(roomId);

    if (!room) {
        res.json({
            error: {
                id: error.ROOM_NOT_FOUND.id,
                message: error.ROOM_NOT_FOUND.message.replace('{{roomId}}', roomId),
            },
        });
        return;
    }

    const lastStates = room.getLastStates(parseInt(count, 10));

    res.json({
        roomId,
        states: lastStates,
    });
}
