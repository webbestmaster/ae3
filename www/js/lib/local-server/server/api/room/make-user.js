// @flow

import {roomMaster} from '../../../room/master';
import {LocalExpressRequest} from '../../../local-express/request';
import {LocalExpressResponse} from '../../../local-express/response';
import {error} from '../error';
import {messageConst} from '../../../room/message-const';

export function makeUser(req: LocalExpressRequest, res: LocalExpressResponse) {
    const {params} = req;
    const {type, roomId} = params;

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

    if (type === 'bot' || type === 'human') {
        const user = room.makeUser(type);

        res.json({
            type: messageConst.type.joinIntoRoom,
            roomId,
            userId: user.userId,
            socketId: user.socketId,
        });

        return;
    }

    res.json({
        error: {
            id: error.WRONG_PARAMETERS.id,
            message: error.WRONG_PARAMETERS.message.replace('{{params}}', JSON.stringify(params)),
        },
    });
}
