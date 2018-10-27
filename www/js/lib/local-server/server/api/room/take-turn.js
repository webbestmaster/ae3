// @flow

import {roomMaster} from '../../../room/master';
import {LocalExpressRequest} from '../../../local-express/request';
import {LocalExpressResponse} from '../../../local-express/response';
import {error} from '../error';
import {messageConst} from '../../../room/message-const';

export function takeTurn(req: LocalExpressRequest, res: LocalExpressResponse) {
    const {params} = req;
    const {roomId, userId} = params;

    const room = roomMaster.getRoomById(roomId);

    if (!room) {
        res.json({
            error: {
                id: error.ROOM_NOT_FOUND.id,
                message: error.ROOM_NOT_FOUND.message.replace('{{roomId}}', roomId)
            }
        });
        return;
    }

    const activeUserId = room.giveTurn(userId);

    res.json({
        type: messageConst.type.takeTurn,
        roomId,
        activeUserId
    });
}
