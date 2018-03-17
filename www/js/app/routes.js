// @flow

type RoutesType = {|
    index: string,
    multiPlayer: string,
    createRoom: string,
    joinRoom: string
|};

const routes: RoutesType = {
    index: '/',
    multiPlayer: '/multi-player',
    createRoom: '/create-room',
    joinRoom: '/join-room'
};

export default routes;
