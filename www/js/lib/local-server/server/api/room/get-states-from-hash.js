// @flow

import {roomMaster} from '../../../room/master';
import {LocalExpressRequest} from '../../../local-express/request';
import {LocalExpressResponse} from '../../../local-express/response';
import error from '../error-data';
import messageConst from '../../../room/message-data';

export default (req: LocalExpressRequest, res: LocalExpressResponse) => {
    const {params} = req;
    const {roomId, hash} = params;

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

    const states = room.getStatesFromHash(hash);

    res.json({
        roomId,
        states
    });
};
