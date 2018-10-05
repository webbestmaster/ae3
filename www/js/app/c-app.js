// @flow

import type {Node} from 'react';
import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import System from '../components/system/c-system';
import Auth from '../components/auth/c-auth';

import Home from '../page/home/p-home';
import MultiPlayer from '../page/multi-player/p-multi-player';
import CreateRoom from '../page/create-room/p-create-room';
import JoinRoom from '../page/join-room/p-join-room';
import Room from '../page/room/p-room';
import Settings from '../page/settings/p-settings';

import routes from './routes';

export default (): Node[] => [
    <Auth key="auth"/>,
    <System key="system"/>,
    <Switch key="switch">
        <Route component={Home} path={routes.index} exact/>
        <Route component={MultiPlayer} path={routes.multiPlayer} exact/>
        <Route component={CreateRoom} path={routes.createRoomOnline} exact/>
        <Route component={CreateRoom} path={routes.createRoomOffline} exact/>
        <Route component={JoinRoom} path={routes.joinRoom} exact/>
        <Route component={Room} path={routes.roomOnLine} exact/>
        <Route component={Room} path={routes.roomOffLine} exact/>
        <Route component={Settings} path={routes.settings} exact/>
    </Switch>
];
