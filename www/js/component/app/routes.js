// @flow

const onLinePrefix = '/on-line';
const offLinePrefix = '/off-line';

type RoutesType = {|
    index: string,
    multiPlayer: string,
    // singlePlayer: string,
    createRoomOnline: string,
    createRoomOffline: string,
    joinRoom: string,
    roomOnLine: string,
    roomOffLine: string,
    settings: string
|};

const routes: RoutesType = {
    index: '/',
    multiPlayer: onLinePrefix + '/multi-player',
    // singlePlayer: '/single-player',
    createRoomOnline: onLinePrefix + '/create-room',
    createRoomOffline: offLinePrefix + '/create-room',
    joinRoom: onLinePrefix + '/join-room',
    roomOnLine: onLinePrefix + '/room/:roomId',
    roomOffLine: offLinePrefix + '/room/:roomId',
    settings: '/settings'
};

export default routes;
