// @flow

import {Server} from '../../server';
import {LocalExpressRequest} from '../../../local-express/request';
import {LocalExpressResponse} from '../../../local-express/response';
import {Room} from '../../../room/room';

export default (req: LocalExpressRequest, res: LocalExpressResponse, server: Server) => {
    const room = new Room({server});

    res.json({roomId: room.getId()});
};
