// @flow
import {Server} from './server';
import {LocalExpressRequest} from '../local-express/request';
import {LocalExpressResponse} from '../local-express/response';

import {create} from './api/room/create';
import {getIds} from './api/room/get-ids';

import {join} from './api/room/join';
import {makeUser} from './api/room/make-user';
import {leave} from './api/room/leave';

import {dropTurn} from './api/room/drop-turn';
import {takeTurn} from './api/room/take-turn';

import {getUsers} from './api/room/get-users';
import {pushState} from './api/room/push-state';
import {getLastStates} from './api/room/get-last-states';

import {getAllSettings} from './api/room/get-all-settings';
import {getSetting} from './api/room/get-setting';
import {setAllSettings} from './api/room/set-all-settings';
import {setSetting} from './api/room/set-setting';

import {getAllStates} from './api/room/get-all-states';
import {getStatesFromHash} from './api/room/get-states-from-hash';

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
            create(req, res, server);
        });

        /**
         * get room ids
         */
        expressApp.get('/api/room/get-ids', getIds);

        /**
         * join to room
         */
        expressApp.get('/api/room/join/:roomId/:userId/:socketId', join);

        /**
         * make human or bot
         */
        expressApp.get('/api/room/make/:type/:roomId', makeUser);

        /**
         * leave to room
         */
        expressApp.get('/api/room/leave/:roomId/:userId', leave);

        /**
         * take a turn
         */
        expressApp.get('/api/room/take-turn/:roomId/:userId', takeTurn);

        /**
         * drop a turn
         */
        expressApp.get('/api/room/drop-turn/:roomId/:userId', dropTurn);

        /**
         * get users
         */
        expressApp.get('/api/room/get-users/:roomId', getUsers);

        /**
         * push a state
         */
        expressApp.post('/api/room/push-state/:roomId/:userId', pushState);

        /**
         * get last states
         */
        expressApp.get('/api/room/get-last-states/:roomId/:count', getLastStates);

        /**
         * get states from hash
         */
        expressApp.get('/api/room/get-states-from-hash/:roomId/:hash', getStatesFromHash);

        /**
         * get all states
         */
        expressApp.get('/api/room/get-all-states/:roomId', getAllStates);

        /**
         * get all settings
         */
        expressApp.get('/api/room/get-all-settings/:roomId', getAllSettings);

        /**
         * get setting by key
         */
        expressApp.get('/api/room/get-setting/:roomId/:key', getSetting);

        /**
         * set all settings
         */
        expressApp.post('/api/room/set-all-settings/:roomId', setAllSettings);

        /**
         * set setting by {key: value}
         */
        expressApp.post('/api/room/set-setting/:roomId', setSetting);
    }
};
