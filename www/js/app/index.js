// @flow

import type {Node} from 'react';
import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import System from './../components/system';
import Auth from './../components/auth';

import Home from './../page/home';
import MultiPlayer from './../page/multi-player';
import SinglePlayer from './../page/single-player';
import CreateRoom from './../page/create-room';
import JoinRoom from './../page/join-room';
import Room from './../page/room';

import routes from './routes';

export default (): Node[] =>
    [
        <Auth key="auth"/>,
        <System key="system"/>,
        <Switch key="switch">
            <Route
                component={Home}
                exact
                path={routes.index}
            />
            <Route
                component={MultiPlayer}
                exact
                path={routes.multiPlayer}
            />
            <Route
                component={CreateRoom}
                exact
                path={routes.createRoomOnline}
            />
            <Route
                component={CreateRoom}
                exact
                path={routes.createRoomOnline}
            />
            <Route
                component={JoinRoom}
                exact
                path={routes.joinRoom}
            />
            {/*
                <Route
                    component={SinglePlayer}
                    exact
                    path={routes.singlePlayer}
                />
            */}
            <Route
                component={Room}
                exact
                path={routes.room}
            />
        </Switch>
    ];
