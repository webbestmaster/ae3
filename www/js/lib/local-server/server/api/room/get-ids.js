// @flow

import {roomMaster} from '../../../room/master';
import {LocalExpressRequest} from '../../../local-express/request';
import {LocalExpressResponse} from '../../../local-express/response';

export function getIds(req: LocalExpressRequest, res: LocalExpressResponse) {
    res.json({roomIds: roomMaster.getRoomIds()});
}
