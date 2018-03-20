// @flow

type RoutesType = {|
    index: string,
    multiPlayer: string,
    createRoom: string,
    joinRoom: string,
    room: string
|};

const routes: RoutesType = {
    index: '/',
    multiPlayer: '/multi-player',
    createRoom: '/create-room',
    joinRoom: '/join-room',
    room: '/room/:roomId'
};

export default routes;

export type HistoryType = {|
    push: (route: string) => void
|};

export type MatchType = {|
    params: {
        roomId?: string
    },
    path: string,
    url: string
|};
