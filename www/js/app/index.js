// @flow

import React, {Component} from 'react';
import type {Node} from 'react';
import {Switch, Route, Link, BrowserRouter} from 'react-router-dom';
import System from './../components/system';
import Auth from './../components/auth';

import Index from './../page/index';
import MultiPlayer from './../page/multi-player';
import CreateRoom from './../page/create-room';
import JoinRoom from './../page/join-room';

import routes from './routes';

export default (): Node[] =>
    [
        <Auth key="auth"/>,
        <System key="system"/>,
        <Switch key="switch">
            <Route path={routes.index} component={Index} exact/>
            <Route path={routes.multiPlayer} component={MultiPlayer} exact/>
            <Route path={routes.createRoom} component={CreateRoom} exact/>
            <Route path={routes.joinRoom} component={JoinRoom} exact/>
        </Switch>
    ];