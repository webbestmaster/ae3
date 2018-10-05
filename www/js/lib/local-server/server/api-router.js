// @flow
import {Server} from './server';
import {LocalExpressRequest} from '../local-express/request';
import {LocalExpressResponse} from '../local-express/response';

import apiRoomCreate from './api/room/create';
import apiRoomGetIds from './api/room/get-ids';

import apiRoomJoin from './api/room/join';
import apiRoomMakeUser from './api/room/make-user';
import apiRoomLeave from './api/room/leave';

import apiRoomDropTurn from './api/room/drop-turn';
import apiRoomTakeTurn from './api/room/take-turn';

import apiRoomGetUsers from './api/room/get-users';
import apiRoomPushState from './api/room/push-state';
import apiGetLastStates from './api/room/get-last-states';

import apiGetAllSettings from './api/room/get-all-settings';
import apiGetSetting from './api/room/get-setting';
import apiSetAllSettings from './api/room/set-all-settings';
import apiSetSetting from './api/room/set-setting';

import apiGetAllStates from './api/room/get-all-states';
import apiGetStatesFromHash from './api/room/get-states-from-hash';

export const apiRouter = {
    bindRoutes: (server: Server) => {
        // eslint-disable-next-line max-statements
        const expressApp = server.getExpressApp();

        // fix CORS
        // expressApp.use((req, res, next) => {
        //     res.header('Access-Control-Allow-Origin', '*');
        //     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        //     next();
        // });

        // expressApp.use(bodyParser.urlencoded({extended: false}));
        // expressApp.use(bodyParser.json());

        /**
         * create room
         */
        expressApp.get('/api/room/create', (req: LocalExpressRequest, res: LocalExpressResponse) => {
            apiRoomCreate(req, res, server);
        });

        /**
         * get room ids
         */
        expressApp.get('/api/room/get-ids', apiRoomGetIds);

        /**
         * join to room
         */
        expressApp.get('/api/room/join/:roomId/:userId/:socketId', apiRoomJoin);

        /**
         * make human or bot
         */
        expressApp.get('/api/room/make/:type/:roomId', apiRoomMakeUser);

        /**
         * leave to room
         */
        expressApp.get('/api/room/leave/:roomId/:userId', apiRoomLeave);

        /**
         * take a turn
         */
        expressApp.get('/api/room/take-turn/:roomId/:userId', apiRoomTakeTurn);

        /**
         * drop a turn
         */
        expressApp.get('/api/room/drop-turn/:roomId/:userId', apiRoomDropTurn);

        /**
         * get users
         */
        expressApp.get('/api/room/get-users/:roomId', apiRoomGetUsers);

        /**
         * push a state
         */
        expressApp.post('/api/room/push-state/:roomId/:userId', apiRoomPushState);

        /**
         * get last states
         */
        expressApp.get('/api/room/get-last-states/:roomId/:count', apiGetLastStates);

        /**
         * get states from hash
         */
        expressApp.get('/api/room/get-states-from-hash/:roomId/:hash', apiGetStatesFromHash);

        /**
         * get all states
         */
        expressApp.get('/api/room/get-all-states/:roomId', apiGetAllStates);

        /**
         * get all settings
         */
        expressApp.get('/api/room/get-all-settings/:roomId', apiGetAllSettings);

        /**
         * get setting by key
         */
        expressApp.get('/api/room/get-setting/:roomId/:key', apiGetSetting);

        /**
         * set all settings
         */
        expressApp.post('/api/room/set-all-settings/:roomId', apiSetAllSettings);

        /**
         * set setting by {key: value}
         */
        expressApp.post('/api/room/set-setting/:roomId', apiSetSetting);
    }
};
